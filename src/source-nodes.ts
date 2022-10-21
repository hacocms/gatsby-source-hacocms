import type { SourceNodesArgs } from "gatsby"
import type { ValidPluginOptions } from "./plugin-options-schema"

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type RequiredSourceNodesArgs = Pick<
  SourceNodesArgs,
  "actions" | "createContentDigest" | "createNodeId"
>

export const sourceApiNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  api: ArrayElement<NonNullable<ValidPluginOptions["apis"]>>
) => {
  const { createNode } = actions

  const { ApiContent } = await import(`hacocms-js-sdk`)
  class AnyContent extends ApiContent {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(json: any) {
      super(json)
      Object.assign(this, json)
    }
  }

  let total: number | undefined
  let offset = 0
  do {
    const { data: contents, meta } = await client.getList(
      AnyContent,
      `/${api.endpoint}`,
      { offset }
    )

    for (const content of contents) {
      createNode({
        ...content,
        hacocmsId: content.id,
        id: createNodeId(`${api.endpoint}-${content.id}`),
        parent: null,
        children: [],
        internal: {
          type: api.endpoint,
          contentDigest: createContentDigest(content),
        },
      })
    }

    if (typeof total === `undefined`) {
      total = meta.total
    } else if (total !== meta.total) {
      console.warn(
        `total returned from API is different previous one: ${total} -> ${meta.total}`
      )
      total = meta.total
    }
    offset += contents.length
  } while (total && total > offset)
}

export const sourceNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  pluginOptions: ValidPluginOptions
) => {
  const { HacoCmsClient } = await import(`hacocms-js-sdk`)
  const client = new HacoCmsClient(
    `https://${pluginOptions.subdomain}.hacocms.com`,
    pluginOptions.accessToken
  )
  for (const api of pluginOptions.apis || []) {
    await sourceApiNodes(
      { actions, createContentDigest, createNodeId },
      client,
      api
    )
  }
}

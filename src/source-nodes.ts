import type { SourceNodesArgs } from "gatsby"
import { ApiContent, HacoCmsClient, JsonType } from "hacocms-js-sdk"
import type { ValidPluginOptions } from "./plugin-options-schema"

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type RequiredSourceNodesArgs = Pick<
  SourceNodesArgs,
  "actions" | "createContentDigest" | "createNodeId"
>

export const sourceApiNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  client: HacoCmsClient,
  api: ArrayElement<NonNullable<ValidPluginOptions["apis"]>>
) => {
  const { createNode } = actions

  class AnyContent extends ApiContent {
    constructor(json: JsonType<AnyContent>) {
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

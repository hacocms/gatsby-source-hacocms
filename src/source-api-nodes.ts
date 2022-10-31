import type { SourceNodesArgs } from "gatsby"
import { ApiContent, HacoCmsClient, type JsonType } from "hacocms-js-sdk"

export type RequiredSourceNodesArgs = Pick<
  SourceNodesArgs,
  "actions" | "createContentDigest" | "createNodeId"
>

class AnyContent extends ApiContent {
  constructor(json: JsonType<AnyContent>) {
    super(json)
    Object.assign(this, json)
  }
}

export const sourceListApiNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  client: HacoCmsClient,
  endpoint: string
) => {
  const { createNode } = actions

  let total: number | undefined
  let offset = 0
  do {
    const { data: contents, meta } = await client.getList(
      AnyContent,
      `/${endpoint}`,
      { offset }
    )

    for (const content of contents) {
      createNode({
        ...content,
        hacocmsId: content.id,
        id: createNodeId(`${endpoint}-${content.id}`),
        parent: null,
        children: [],
        internal: {
          type: endpoint,
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

export const sourceSingleApiNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  client: HacoCmsClient,
  endpoint: string
) => {
  const { createNode } = actions

  const content = await client.getSingle(AnyContent, `/${endpoint}`)

  createNode({
    ...content,
    hacocmsId: content.id,
    id: createNodeId(`${endpoint}-${content.id}`),
    parent: null,
    children: [],
    internal: {
      type: endpoint,
      contentDigest: createContentDigest(content),
    },
  })
}

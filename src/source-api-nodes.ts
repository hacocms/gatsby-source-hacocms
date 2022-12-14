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
  endpoint: string,
  includesDraft: boolean
) => {
  const { createNode } = actions

  const getList = (
    includesDraft ? client.getListIncludingDraft : client.getList
  ).bind(client)

  let total: number | undefined
  let offset = 0
  do {
    const { data: contents, meta } = await getList(AnyContent, `/${endpoint}`, {
      offset,
    })

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
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  includesDraft: boolean
) => {
  const { createNode } = actions

  // if client is given Project-Draft-Token, i.e. includesDraft is true, getSingle gets draft contents
  // see also https://github.com/hacocms/hacocms-js-sdk/issues/77
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

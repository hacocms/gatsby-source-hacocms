import { HacoCmsClient } from "hacocms-js-sdk"
import type { ValidPluginOptions } from "./plugin-options-schema"
import {
  sourceListApiNodes,
  sourceSingleApiNodes,
  type RequiredSourceNodesArgs,
} from "./source-api-nodes"

export const sourceNodes = async (
  { actions, createContentDigest, createNodeId }: RequiredSourceNodesArgs,
  pluginOptions: ValidPluginOptions
) => {
  const client = new HacoCmsClient(
    `https://${pluginOptions.subdomain}.hacocms.com`,
    pluginOptions.accessToken
  )
  for (const { endpoint, shape } of pluginOptions.apis || []) {
    if (shape === `list`) {
      await sourceListApiNodes(
        { actions, createContentDigest, createNodeId },
        client,
        endpoint
      )
    } else {
      await sourceSingleApiNodes(
        { actions, createContentDigest, createNodeId },
        client,
        endpoint
      )
    }
  }
}

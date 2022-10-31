import type { SourceNodesArgs } from "gatsby"
import { HacoCmsClient } from "hacocms-js-sdk"
import type { ValidPluginOptions } from "./plugin-options-schema"
import { sourceApiNodes } from "./source-api-nodes"

export const sourceNodes = async (
  { actions, createContentDigest, createNodeId }: SourceNodesArgs,
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

import { jest } from "@jest/globals"
import { createContentDigest } from "gatsby-core-utils"
import { actions as originalActions } from "gatsby/dist/redux/actions"
import { HacoCmsClient } from "hacocms-js-sdk"
import { sourceNodes } from "../source-nodes"

let currentNodeMap = new Map()
const createNode = jest.fn((node, ...args) => {
  originalActions.createNode(node, ...args)
  currentNodeMap.set(node.id, node)
})
const actions = {
  ...originalActions,
  createNode,
}
const createNodeId = jest.fn(value => value)

beforeEach(() => {
  currentNodeMap = new Map()
  createNode.mockClear()
  createNodeId.mockClear()
})

const dummySubdomain = `dummy.hacocms.com`
const dummyAccessToken = `DUMMY_ACCESS_TOKEN`

describe(`sourceNodes`, () => {
  it(`should generate nodes`, async () => {
    jest
      .spyOn(HacoCmsClient.prototype, `getList`)
      .mockImplementationOnce(Content =>
        Promise.resolve({
          data: [
            new Content({
              id: `abcdef`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              closedAt: null,
            }),
          ],
          meta: { total: 1, limit: 100, offset: 0 },
        })
      )
    jest
      .spyOn(HacoCmsClient.prototype, `getSingle`)
      .mockImplementationOnce(Content =>
        Promise.resolve(
          new Content({
            id: `ghijkl`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            closedAt: null,
          })
        )
      )

    await sourceNodes(
      { actions, createContentDigest, createNodeId },
      {
        subdomain: dummySubdomain,
        accessToken: dummyAccessToken,
        apis: [
          {
            endpoint: `entries`,
            shape: `list`,
          },
          {
            endpoint: `profile`,
            shape: `single`,
          },
        ],
      }
    )

    expect(currentNodeMap.size).toBe(2)
  })
})

import { jest } from "@jest/globals"
import { createContentDigest } from "gatsby-core-utils"
import { actions as originalActions } from "gatsby/dist/redux/actions"
import { sourceApiNodes } from "../source-nodes"

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

const dummyBaseUrl = `https://dummy.hacocms.com/`
const dummyAccessToken = `DUMMY_ACCESS_TOKEN`

describe(`sourceApiNodes`, () => {
  it(`should generate no nodes if empty list is returned`, async () => {
    const { HacoCmsClient } = await import(`hacocms-js-sdk`)
    jest.spyOn(HacoCmsClient.prototype, `getList`).mockImplementation(() =>
      Promise.resolve({
        data: [],
        meta: { total: 0, limit: 100, offset: 0 },
      })
    )

    const client = new HacoCmsClient(dummyBaseUrl, dummyAccessToken)

    await sourceApiNodes(
      { actions, createContentDigest, createNodeId },
      client,
      { endpoint: `endpoint` }
    )

    expect(createNode).toBeCalledTimes(0)
  })

  it(`should generate an node, which fields includes original ones excluding "id" renamed to "hacocmsId"`, async () => {
    const { HacoCmsClient } = await import(`hacocms-js-sdk`)
    jest.spyOn(HacoCmsClient.prototype, `getList`).mockImplementation(Content =>
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

    const client = new HacoCmsClient(dummyBaseUrl, dummyAccessToken)

    await sourceApiNodes(
      { actions, createContentDigest, createNodeId },
      client,
      { endpoint: `endpoint` }
    )

    expect(currentNodeMap.size).toBe(1)

    const node = currentNodeMap.values().next().value
    expect(Object.keys(node)).toEqual(
      expect.arrayContaining([
        `hacocmsId`, // should be renamed from 'id' of the content
        `createdAt`,
        `updatedAt`,
        `publishedAt`,
        `closedAt`,
      ])
    )
    expect(node.hacocmsId).toBe(`abcdef`) // should be renamed from 'id' of the content
  })

  it(`should generate nodes, which the number of those is same as returned`, async () => {
    const { HacoCmsClient } = await import(`hacocms-js-sdk`)
    jest.spyOn(HacoCmsClient.prototype, `getList`).mockImplementation(Content =>
      Promise.resolve({
        data: [
          new Content({
            id: `abcdef`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            closedAt: null,
          }),
          new Content({
            id: `ghijkl`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            closedAt: null,
          }),
        ],
        meta: { total: 2, limit: 100, offset: 0 },
      })
    )

    const client = new HacoCmsClient(dummyBaseUrl, dummyAccessToken)

    await sourceApiNodes(
      { actions, createContentDigest, createNodeId },
      client,
      { endpoint: `endpoint` }
    )

    expect(createNode).toBeCalledTimes(2)
    expect(createNodeId).toBeCalledTimes(2)
    expect(currentNodeMap.size).toBe(2)
  })

  it(`should generate all nodes even if they are in more than one page`, async () => {
    const manyContentsJson = [...new Array(120)].map((_, i) => ({
      id: i.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      closedAt: null,
    }))

    const { HacoCmsClient } = await import(`hacocms-js-sdk`)
    const spyGetList = jest
      .spyOn(HacoCmsClient.prototype, `getList`)
      .mockClear()
      .mockImplementationOnce(Content => {
        return Promise.resolve({
          data: manyContentsJson.slice(0, 100).map(json => new Content(json)),
          meta: { total: manyContentsJson.length, limit: 100, offset: 0 },
        })
      })
      .mockImplementationOnce(Content => {
        return Promise.resolve({
          data: manyContentsJson.slice(100, 120).map(json => new Content(json)),
          meta: { total: manyContentsJson.length, limit: 100, offset: 100 },
        })
      })

    const client = new HacoCmsClient(dummyBaseUrl, dummyAccessToken)

    await sourceApiNodes(
      { actions, createContentDigest, createNodeId },
      client,
      { endpoint: `endpoint` }
    )

    expect(spyGetList.mock.calls.map(([, , query]) => query?.offset)).toEqual([
      0, 100,
    ])

    expect(createNode).toBeCalledTimes(manyContentsJson.length)
    expect(createNodeId).toBeCalledTimes(manyContentsJson.length)
    expect(currentNodeMap.size).toBe(manyContentsJson.length)
  })
})

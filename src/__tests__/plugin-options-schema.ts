import { testPluginOptionsSchema } from "gatsby-plugin-utils"
import { pluginOptionsSchema } from "../plugin-options-schema"

describe(`pluginOptionsSchema`, () => {
  it(`should invalidate options without \`subdomain\``, async () => {
    const options = {}
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(false)
    expect(errors).toContain(`"subdomain" is required`)
  })

  it(`should invalidate options without \`accessToken\``, async () => {
    const options = {}
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(false)
    expect(errors).toContain(`"accessToken" is required`)
  })

  it(`should validate options including all required ones`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should validate options including projectDraftToken in addition to all required ones`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      projectDraftToken: `DUMMY_PROJECT_DRAFT_TOKEN`,
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should invalidate options including "apis" with an invalid element`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{}],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(false)
    expect(errors).toEqual([`"apis[0].endpoint" is required`])
  })

  it(`should validate options including "apis" with an valid endpoint`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{ endpoint: `endpoint` }],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should validate options including "apis" with some valid endpoints`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{ endpoint: `endpoint` }, { endpoint: `another` }],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should validate options including "apis" with an single-shape endpoint`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{ endpoint: `endpoint`, shape: `single` }],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should validate options including "apis" with an list-shape endpoint`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{ endpoint: `endpoint`, shape: `list` }],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it(`should invalidate options including "apis" with an invalid-shape endpoint`, async () => {
    const options = {
      subdomain: `example-example`,
      accessToken: `DUMMY_ACCESS_TOKEN`,
      apis: [{ endpoint: `endpoint`, shape: `invalid_shape` }],
    }
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options
    )
    expect(isValid).toBe(false)
    expect(errors).toEqual([`"apis[0].shape" must be one of [list, single]`])
  })
})

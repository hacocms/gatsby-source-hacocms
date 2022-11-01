import type { PluginOptionsSchemaArgs } from "gatsby"

const validApiShapes = [`list`, `single`] as const

export type ValidPluginOptions = {
  subdomain: string
  accessToken: string
  apis?: Array<{
    endpoint: string
    shape: typeof validApiShapes[number]
  }>
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    subdomain: Joi.string().required().description(`hacoCMS project subdomain`),
    accessToken: Joi.string()
      .required()
      .description(`Access-Token of the project`),
    apis: Joi.array()
      .items(
        Joi.object({
          endpoint: Joi.string().required().description(`API endpoint`),
          shape: Joi.string()
            .valid(...validApiShapes)
            .default(`list`)
            .description(`API shape (list or single)`),
        })
      )
      .default([])
      .description(`API(s) to source`),
  })

import type { PluginOptionsSchemaArgs } from "gatsby"

export type ValidPluginOptions = {
  subdomain: string
  accessToken: string
  apis?: Array<{
    endpoint: string
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
        })
      )
      .default([])
      .description(`API(s) to source`),
  })

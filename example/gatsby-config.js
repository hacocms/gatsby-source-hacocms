require(`dotenv`).config()

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-hacocms`,
      options: {
        subdomain: process.env.HACOCMS_API_SUBDOMAIN,
        accessToken: process.env.HACOCMS_API_ACCESS_TOKEN,
        apis: [
          {
            endpoint: `entries`,
          },
        ],
      },
    },
  ],
}

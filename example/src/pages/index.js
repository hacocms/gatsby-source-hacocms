import { graphql, Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

export const query = graphql`
  query HomeQuery {
    allEntries(sort: { order: DESC, fields: publishedAt }) {
      nodes {
        id
        title
        description

        pagePath: gatsbyPath(filePath: "/entry/{Entries.id}")
      }
    }
  }
`

export default function Home({ data }) {
  const entries = data.allEntries.nodes
  return (
    <>
      <h1>gatsby-source-hacocms example</h1>
      {entries.map(entry => (
        <section key={entry.id}>
          <h2>
            <Link to={entry.pagePath}>{entry.title}</Link>
          </h2>
          <p>{entry.description}</p>
        </section>
      ))}
    </>
  )
}

Home.propTypes = {
  data: PropTypes.object,
}

import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

export const query = graphql`
  query EntryQuery($id: String) {
    entries(id: { eq: $id }) {
      title
      body
    }
  }
`

export default function Entry({ data }) {
  const entry = data.entries
  return (
    <>
      <h1>{entry.title}</h1>
      <main dangerouslySetInnerHTML={{ __html: entry.body }} />
      <Link to="/">Back to Home</Link>
    </>
  )
}

Entry.propTypes = {
  data: PropTypes.object,
}

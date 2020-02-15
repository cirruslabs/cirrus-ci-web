import React from 'react';

import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

export default function() {
  return (
    <div style={{ height: '100vh' }}>
      <GraphiQL
        schema={undefined}
        query={`query {
  viewer {
    id
    githubUserName
  }
}`}
        fetcher={async graphQLParams => {
          const data = await fetch('https://api.cirrus-ci.com/graphql', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'include',
          });
          return data.json().catch(() => data.text());
        }}
      />
    </div>
  );
}

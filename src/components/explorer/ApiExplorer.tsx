import React from 'react';

import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import { Helmet as Head } from 'react-helmet';

const ApiExplorer = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <title>API Explorer - Cirrus CI</title>
      </Head>
      <GraphiQL
        schema={undefined}
        query={`\
query {
  viewer {
    id
    githubUserName
  }
}
`}
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
};

export default ApiExplorer;

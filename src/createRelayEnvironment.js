const {
    Environment,
    Network,
    RecordSource,
    Store,
} = require('relay-runtime');

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
    operation,
    variables,
    cacheConfig,
    uploadables,
) {
    return fetch('http://api.cirrus-ci.org/graphql', {
        method: 'POST',
        credentials: 'include', // cookies
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: operation.text, // GraphQL text from input
            variables,
        }),
    }).then(response => {
        return response.json();
    });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

const source = new RecordSource();
const store = new Store(source);

export default new Environment({
    network,
    store,
});
import ip from 'ip';

const staticPath = `${ip.address()}:3000`;

// Ensures string values are safe to be used within a <script> tag.
// TODO: I don't think that's the right escape function
function safeSerialize(data) {
  return data ? JSON.stringify(data).replace(/\//g, '\\/') : null;
}

export function renderGraphiQL(data) {
  const endpointURL = data.endpointURL;
  const subscriptionsEndpoint = data.subscriptionsEndpoint;
  const usingSubscriptions = !!subscriptionsEndpoint;
  const queryString = data.query;
  const variablesString =
    data.variables ? JSON.stringify(data.variables, null, 2) : null;
  const resultString = null;
  const operationName = data.operationName;
  const passHeader = data.passHeader ? data.passHeader : '';

  /* eslint-disable max-len */
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GraphiQL - Parlament</title>
  <meta name="robots" content="noindex" />
  <style>
    html, body {
      height: 100%;
      margin: 0;
      overflow: hidden;
      width: 100%;
    }
  </style>
  <link href="//${staticPath}/graphiql-resources/graphiql@0.11.2.css" rel="stylesheet" />
  <script src="//${staticPath}/graphiql-resources/fetch@0.9.0.min.js"></script>
  <script src="//${staticPath}/graphiql-resources/react@15.6.1.min.js"></script>
  <script src="//${staticPath}/graphiql-resources/react-dom@15.6.1.min.js"></script>
  <script src="//${staticPath}/graphiql-resources/graphiql@0.11.2.min.js"></script>
  ${usingSubscriptions ?
    `<script src="//${staticPath}/graphiql-resources/subscriptions-transport-ws@0.7.0.js"></script>` +
    `<script src="//${staticPath}/graphiql-resources/graphiql-subscriptions-fetcher-client@0.0.2.js"></script>`
    : ''}
</head>
<body>
  <h1>DanishGod</h1>
  <script>
    // Collect the URL parameters
    var parameters = {};
    window.location.search.substr(1).split('&').forEach(function (entry) {
      var eq = entry.indexOf('=');
      if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] =
          decodeURIComponent(entry.slice(eq + 1));
      }
    });
    // Produce a Location query string from a parameter object.
    function locationQuery(params, location) {
      return (location ? location: '') + '?' + Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(params[key]);
      }).join('&');
    }
    // Derive a fetch URL from the current URL, sans the GraphQL parameters.
    var graphqlParamNames = {
      query: true,
      variables: true,
      operationName: true
    };
    var otherParams = {};
    for (var k in parameters) {
      if (parameters.hasOwnProperty(k) && graphqlParamNames[k] !== true) {
        otherParams[k] = parameters[k];
      }
    }

    var fetcher;

    if (${usingSubscriptions}) {
      var subscriptionsClient = new window.SubscriptionsTransportWs.SubscriptionClient('${subscriptionsEndpoint}', {
        reconnect: true
      });
      fetcher = window.GraphiQLSubscriptionsFetcher.graphQLFetcher(subscriptionsClient, graphQLFetcher);
    } else {
      fetcher = graphQLFetcher;
    }

    // We don't use safe-serialize for location, because it's not client input.
    var fetchURL = locationQuery(otherParams, '${endpointURL}');

    // Defines a GraphQL fetcher using the fetch API.
    function graphQLFetcher(graphQLParams) {
        return fetch(fetchURL, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ${passHeader}
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'include',
        }).then(function (response) {
          return response.text();
        }).then(function (responseBody) {
          try {
            return JSON.parse(responseBody);
          } catch (error) {
            return responseBody;
          }
        });
    }
    // When the query and variables string is edited, update the URL bar so
    // that it can be easily shared.
    function onEditQuery(newQuery) {
      parameters.query = newQuery;
      updateURL();
    }
    function onEditVariables(newVariables) {
      parameters.variables = newVariables;
      updateURL();
    }
    function onEditOperationName(newOperationName) {
      parameters.operationName = newOperationName;
      updateURL();
    }
    function updateURL() {
      history.replaceState(null, null, locationQuery(parameters) + window.location.hash);
    }
    // Render <GraphiQL /> into the body.
    ReactDOM.render(
      React.createElement(GraphiQL, {
        fetcher: fetcher,
        onEditQuery: onEditQuery,
        onEditVariables: onEditVariables,
        onEditOperationName: onEditOperationName,
        query: ${safeSerialize(queryString)},
        response: ${safeSerialize(resultString)},
        variables: ${safeSerialize(variablesString)},
        operationName: ${safeSerialize(operationName)},
      }),
      document.body
    );
  </script>
</body>
</html>`;
}

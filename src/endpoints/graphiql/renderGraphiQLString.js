import { GraphiQLData, renderGraphiQL } from './renderGraphiQL';

function isOptionsFunction(arg) {
  return typeof arg === 'function';
}

async function resolveGraphiQLOptions(options, ...args) {
  if (isOptionsFunction(options)) {
    try {
      return await options(...args);
    } catch (e) {
      throw new Error(`Invalid options provided for GraphiQL: ${e.message}`);
    }
  } else {
    return options;
  }
}

function createGraphiQLParams(query) {
  return {
    query: query.query || '',
    variables: query.variables,
    operationName: query.operationName || '',
  };
}

function createGraphiQLData(params, options) {
  return {
    endpointURL: options.endpointURL,
    subscriptionsEndpoint: options.subscriptionsEndpoint,
    query: params.query || options.query,
    variables: params.variables && JSON.parse(params.variables) || options.variables,
    operationName: params.operationName || options.operationName,
    passHeader: options.passHeader,
  };
}

export async function resolveGraphiQLString(query = {}, options, ...args) {
  const graphiqlParams = createGraphiQLParams(query);
  const graphiqlOptions = await resolveGraphiQLOptions(options, ...args);
  const graphiqlData = createGraphiQLData(graphiqlParams, graphiqlOptions);
  return renderGraphiQL(graphiqlData);
}

# graphql-node-server-seed
this seed integrates between graphql-server-express (apollo-server), sequelize and babel.

including full support for babel

# GraphQL-first philosophy
This seed enables a specific workflow for developing a GraphQL server, where the GraphQL schema is the first thing you design, and acts as the contract between your frontend and backend

1. Use the GraphQL schema language
2. Separate business logic from the schema

to support this philosophy we seperate each component into 4 catagories:
## schema
each component should have a `.gql` file that is written in the `GraphQL schema language` that describes the components data, and actions
## resolvers
connects between the api level and the bl level - each resolver function should be very thin 
## model
like a service in `mvc`, exposes bl functions that the `resolvers` use
## connector
the `dal` layer, used by the `model` to get the raw data, should incorporate caching if needed see the example with `dataloader` for more information about caching

# Subscriptions
this seed supports `graphql-subscription` and uses `subscriptions-transport-ws` as the network layer,
there are 3 parts that are relevant for subscriptions

## pubsub.js
 it is a simple pubsub implementation, based on EventEmitter
 we use it to subscribe/publish topics

## topics.js
the topics to subscribe/publish

## subscriptions.schema.js
the schema + resolvers of the subscriptions

# Debugging/Running

2 debug options (only in VSCode)
1.  debug the app with `Launch & Debug`
2.  debug the tests with `Mocha Tests`

npm scripts
1. start - running the server with `nodemon`
2. build - transpile the code to the dist folder with `babel`
3. serve - run the transpiled code from the dist folder
4. test  - run all the tests
5. coverage - run tests and coverage using `istanbul`

# Directory Structure

```
.
├── .vscode/*        <- preferences for debugging mainly
├── src              <- source code of the server
│   ├── api              <- graphql schema + resolvers + models + connectors
│   │   ├── root               <- root schema types (query, mutation)
│   │   │   ├── root.gql
│   │   │   ├── root.schema.js
│   │   ├── subscriptions      <- subscriptions schema + pubsub + topics
│   │   │   ├── pubsub.js
│   │   │   ├── subscriptions.gql
│   │   │   ├── subscriptions.schema.js
│   │   │   └── topics.js
│   │   ├── user               <- example api entity
│   │   │   ├── user.connector.js
│   │   │   ├── user.gql
│   │   │   ├── user.model.js
│   │   │   └── user.schema.js
│   │   └── schema.js          <- contains all the exported schemas, resolvers
│   ├── db               <- db models definitions
│   │   ├── models
│   │   │   └── User.js
│   │   └── index.js           <- db connections configurations
│   ├── endpoints
│   │   ├── graphiql           <- offline graphiql endpoint setup
│   │   ├── graphql
│   │   ├── graphql-subscriptions
│   │   └── index.js           
|   ├──  app.js          <- server setup
│   └──  server.js       <- server startup   
├── test                       
│   ├── integration         <- tests that depened on more than one unit to work (almost no mocks)
│   │   └── user               <- example integration test
│   │       └── user.query.test.js
│   └── unit         <- tests that depened on a single unit (mock everything)
│       └── user               <- example unit test
│           └── user.model.test.js
├── .babelrc         <- babel configuration
├── .gitignore
├── LICENSE
├── package.json     <- dependencies of the project
└── README.md
```

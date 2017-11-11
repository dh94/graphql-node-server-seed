const cpx = require('cpx');

if (process.env.NODE_ENV === "test") {
	cpx.copySync("src/api/**/*.{gql,graphql}", ".output/src/api");
	cpx.copySync("src/endpoints/graphiql/resources/*.{js,css}", ".output/endpoints/graphiql/resources")
} else {
	cpx.copySync("src/api/**/*.{gql,graphql}", "dist/api");
	cpx.copySync("src/endpoints/graphiql/resources/*.{js,css}", "dist/endpoints/graphiql/resources")
}
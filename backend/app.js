const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

const app = express()


app.use(bodyParser.json())
app.use(isAuth)
app.use('/graphql', graphqlHttp({
    
    schema: graphQlSchema,
    rootValue: graphQlResolvers,

    graphiql: true
    })
)


mongoose.connect(`${process.env.DB_URL}`, {useNewUrlParser: true})
// mongoose.connect("mongodb://mongo:27017/react-graphql-events", {useNewUrlParser: true})
        .then(() => {
            app.listen(3000)
        })
        .catch(err => {
            console.log(err)
})
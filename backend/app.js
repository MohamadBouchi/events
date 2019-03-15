const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/events')
const User = require('./models/user')


const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    
    schema: buildSchema(`

        type User {
            _id: ID!
            email: String!
            password: String
        }


        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }


        input UserInput {
            email: String!
            password: String!
        }


        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootMutation {
            createUser(userInput: UserInput): User
            createEvent(eventInput: EventInput): Event
        }


        schema {
            query: RootQuery
            mutation: RootMutation
        }
    
    `),


    rootValue: {

        events: () => {
            return Event.find({title: 'test'})
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event._doc._id.toString() }
                    })
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },


        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date (args.eventInput.date)
            })

            return event.save()
                .then(res => {
                    return {...res._doc, _id: event.id}
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
            return event
        },


        createUser: (args) => ({
            email: args.userInput.email,
            password: args.userInput.password
        })
    },

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
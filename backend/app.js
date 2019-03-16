const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Event = require('./models/events')
const User = require('./models/user')


const app = express()

app.use(bodyParser.json())

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
        .then(events => {
            return events.map( event => {
                return { ...event._doc
                        , _id: event.id
                        ,creator: user.bind(this, event.creator)
                    }
            })
        })
        .catch(err => {
            throw err
        })
}
const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { 
                    ...user._doc
                    ,_id: user.id
                    ,createdEvents: events.bind(this, user._doc.createdEvents)
                 }
        })
        .catch(err => {
            throw err
        })
}

app.use('/graphql', graphqlHttp({
    
    schema: buildSchema(`

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }


        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
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
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { 
                            ...event._doc
                            ,_id: event._doc._id.toString()
                            ,creator: user.bind(this, event._doc.creator)
                        }
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
                date: new Date (args.eventInput.date),
                creator: "5c8cefd042ae422e2c9d9dcd"
            })

            let createdEvent;
            return event.save()
                .then(result => {
                    createdEvent = {
                            ...result._doc
                            ,_id: event.id
                            ,creator: user.bind(this, result._doc.creator)
                        }
                    return User.findById('5c8cefd042ae422e2c9d9dcd')
                })
                .then( user => {
                    if(!user)
                        throw new Error('user not found')
                    
                    user.createdEvents.push(event)
                    return user.save()
                })
                .then( () => {
                    return createdEvent
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },



        createUser: (args) => {
            return User.findOne({email: args.userInput.email })
                .then( user => {
                    if(user) {
                        throw new Error('user exist')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save()
                })
                .then(result => {
                    return { ...result._doc, _id:result.id, password: null }
                })
                .catch(err => {
                    throw err
                })
        }
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
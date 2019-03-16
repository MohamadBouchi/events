const { buildSchema } = require('graphql')

module.exports = buildSchema(`

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

`)
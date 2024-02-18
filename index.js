const express = require('express');
const mongoose = require('mongoose');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const  resolvers   = require('./resolvers');

const uri = 'mongodb+srv://f2023_comp3123:fullstack_assignment1@cluster0.w2zjbvo.mongodb.net/101331074_COMP3133_Assignment1?retryWrites=true&w=majority';


mongoose.connect(uri, {}).then(() => {
    console.log('Success MongoDB connection');
}).catch(err => {
    console.log('Error MongoDB connection:', err);
});

// GraphQL Schema
const schema = buildSchema(`

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
    }

    type UserData {
        token: String!
        user: User!
    }

    type Employee {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        salary: String!
    }

    input UpdateEmployeeInput {
        first_name: String
        last_name: String
        email: String
        gender: String
        salary: String
    }


    type Query {
        user(id: String!): User
        login(email: String!, password: String!): UserData
        employee(id: String!) : Employee
        employees: [Employee!]!
    }

    type Mutation {
        signup(username: String!, email: String!,  password: String!): User
        createEmployee(first_name: String!, last_name: String!, email: String!, gender: String! ,salary: String!): Employee
        updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee
        deleteEmployee(id: String!) : String
    }

    schema {
        query: Query
        mutation: Mutation
      }
`);




// Express Server Setup
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));

// Start the server on port 3000
app.listen(3000, () => console.log("Server is running at http://localhost:3000/graphql"));

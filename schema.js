const { gql } = require('@apollo/server');
const express = require('express');
const app = express();
// Définir le schéma GraphQL
const typeDefs = `
type Flight {
id: String!
name: String!
description: String!
}


type Hotel {
id: String!
name: String!
description: String!
}
type Query {
flight(id: String!): Flight
flights: [Flight]
hotel(id: String!): Hotel
hotels: [Hotel]
}

type Mutation {
    createFlight(name: String!, description: String!): Flight
    createHotel(name: String!, description: String!): Hotel
  }
`;

module.exports = typeDefs
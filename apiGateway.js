const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');



const app = express();
const flightProtoPath = 'flight.proto';
const hotelProtoPath = 'hotel.proto';
// Load protobuf definitions
const flightProtoDefinition = protoLoader.loadSync('flight.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hotelProtoDefinition = protoLoader.loadSync('hotel.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const flightProto = grpc.loadPackageDefinition(flightProtoDefinition).flight;
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  await server.start();
  app.use(
    cors(),
    bodyParser.json(), 
    expressMiddleware(server)
  );

  // Define RESTful API routes
  app.get('/flights', (req, res) => {
    const client = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());
    client.searchFlights({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.flights);
      }
    });
  });

  app.get('/flights/:id', (req, res) => {
    const client = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getFlight({ flightId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.flight);
      }
    });
  });

  app.post('/flights', (req, res) => {
    const { name, description } = req.body;
    const flightClient = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());

    flightClient.createFlight({ name, description }, (error, response) => {
      if (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ error: 'Error creating flight' });
      } else {
        res.status(201).json(response.flight);
      } 
    });
  });

  app.get('/hotels', (req, res) => {
    const client = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());
    client.searchHotels({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.hotels);
      }
    });
  });

  app.get('/hotels/:id', (req, res) => {
    const client = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getHotel({ hotelId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.hotel);
      }
    });
  });

  app.post('/hotels', (req, res) => {
    const { name, description } = req.body;
    const hotelClient = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());

    hotelClient.createHotel({ name, description }, (error, response) => {
      if (error) {
        console.error('Error creating hotel:', error);
        res.status(500).json({ error: 'Error creating hotel' });
      } else {
        res.status(201).json(response.hotel);
      } 
    });
  });

  // Start the Express application
  const port = 3000;
  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
  });
})();

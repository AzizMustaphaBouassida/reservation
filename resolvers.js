const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const flightProtoPath = 'flight.proto';
const hotelProtoPath = 'hotel.proto';

const flightProtoDefinition = protoLoader.loadSync(flightProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const flightProto = grpc.loadPackageDefinition(flightProtoDefinition).flight;
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;

const resolvers = {
  Query: {
    flight: (_, { id }) => {
      const client = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getFlight({ id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.flight);
          }
        });
      });
    },
    flights: () => {
      const client = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchFlights({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.flights);
          }
        });
      });
    },
    hotel: (_, { id }) => {
      const client = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getHotel({ id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotel);
          }
        });
      });
    },
    hotels: () => {
      const client = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchHotels({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotels);
          }
        });
      });
    },
  },
  Mutation: {
    createFlight: (_, { name, description }) => {
      const client = new flightProto.FlightService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createFlight({ name, description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.flight);
          }
        });
      });
    },
    createHotel: (_, { name, description }) => {
      const client = new hotelProto.HotelService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createHotel({ name, description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.hotel);
          }
        });
      });
    },
  },
};

module.exports = resolvers;

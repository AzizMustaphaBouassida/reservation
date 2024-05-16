const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Flight = require('./models/Flight');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/databaseSOA');

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Charger le fichier flight.proto
const flightProtoPath = 'flight.proto';
const flightProtoDefinition = protoLoader.loadSync(flightProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const flightProto = grpc.loadPackageDefinition(flightProtoDefinition).flight;

// Implémenter le service flight
const flightService = {
  getFlight: async (call, callback) => {
    try {
      const flight = await Flight.findById(call.request.id);
      if (!flight) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: 'Not Found'
        });
      }
      callback(null, { flight });
    } catch (error) {
      callback(error);
    }
  },
  searchFlights: async (call, callback) => {
    try {
      const flights = await Flight.find({});
      callback(null, { flights });
    } catch (error) {
      callback(error);
    }
  },
  createFlight: async (call, callback) => {
    const { name, description } = call.request;
    const flight = new Flight({ name, description });
    try {
      await flight.save();
      callback(null, { flight });
    } catch (error) {
      callback(error);
    }
  }
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(flightProto.FlightService.service, flightService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});


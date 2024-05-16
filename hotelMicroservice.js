const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/databaseSOA', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// Charger le fichier hotel.proto
const hotelProtoPath = 'hotel.proto';
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;

const hotelService = {
  getHotel: async (call, callback) => {
    try {
      const hotel = await Hotel.findById(call.request.id);
      if (!hotel) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: 'Not Found'
        });
      }
      callback(null, { hotel });
    } catch (error) {
      callback(error);
    }
  },
  searchHotels: async (call, callback) => {
    try {
      const hotels = await Hotel.find({});
      callback(null, { hotels });
    } catch (error) {
      callback(error);
    }
  },
  createHotel: async (call, callback) => {
    const { name, description } = call.request;
    const hotel = new Hotel({ name, description });
    try {
      await hotel.save();
      callback(null, { hotel });
    } catch (error) {
      callback(error);
    }
  }
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(hotelProto.HotelService.service, hotelService);
const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});


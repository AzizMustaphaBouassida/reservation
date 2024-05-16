Flight and Hotel Microservices 
--------Introduction :
This project consists of two microservices designed for managing reservation of flights and hotels. These microservices utilize gRPC for inter-service communication, MongoDB for data storage, and GraphQL for API querying and mutation. The objective is to create an efficient and scalable system for handling flight and hotel reservation data, allowing users to perform CRUD operations through both gRPC and GraphQL interfaces.


------------Microservice: FlightService
The FlightService microservice manages flights within the application, offering functionalities for retrieval, creation, and searching of flight entities.

Data Schema
The FlightService microservice employs the following data schema to represent flight entities:

Flight: Represents a flight entity within the system.

id (String): A unique identifier for the flight.
name (String): The name or title of the flight.
description (String): A detailed description of the flight.
Entry Points
The FlightService microservice exposes the following entry points for interacting with flights:

getFlight: Retrieves detailed information about a specific flight based on its unique identifier.
searchFlights: Retrieves a list of all available flights within the system.
createFlight: Allows the creation of a new flight entity by providing relevant flight information.
Interaction Methods
The FlightService microservice primarily interacts via gRPC, offering efficient and high-performance communication between client and server.

------------Microservice: HotelService
The HotelService microservice manages hotels within the application, providing functionalities for retrieval, creation, and searching of hotel entities.

Data Schema
The HotelService microservice utilizes the following data schema to represent hotel entities:

Hotel: Represents a hotel entity within the system.

id (String): A unique identifier for the hotel.
name (String): The name or title of the hotel.
description (String): A detailed description of the hotel.
Entry Points
The HotelService microservice exposes the following entry points for interacting with hotels:

getHotel: Retrieves detailed information about a specific hotel based on its unique identifier.
searchHotels: Retrieves a list of all available hotels within the system.
createHotel: Allows the creation of a new hotel entity by providing relevant hotel information.

-------Installation:
   
Clone the project repository.
Install Node.js dependencies using npm install.
Set up MongoDB and GraphQL instances.

-------Configuration:
Configure MongoDB connection settings in the respective microservice files.

-------Running the Microservices:
Start the Flight microservice using node FlightMicroservice.js.
Start the Hotel microservice using node HotelMicroservice.js.

-------Testing:
Use gRPC clients or RESTful endpoints to interact with the microservices.
Use GraphQL queries and mutations to test Flight and hotel operations.

----------Interaction Methods
Similar to the FlightService microservice, the HotelService primarily interacts via gRPC, ensuring efficient communication and data exchange between client and server.

--------Integration with GraphQL
Both microservices integrate with GraphQL, offering a flexible and powerful querying and mutation interface. The GraphQL schema defines types and operations for flights and hotels, enabling clients to interact with the microservices seamlessly.

--------RESTful API
In addition to gRPC and GraphQL, the microservices also provide RESTful entry points for basic CRUD (Create, Read, Update, Delete) operations. These RESTful APIs offer compatibility with a wider range of clients and can be accessed using standard HTTP requests.

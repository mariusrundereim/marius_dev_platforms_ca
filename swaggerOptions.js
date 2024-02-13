import "dotenv/config";

const swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description:
        "This is a simple API for managing events, venues, tickets, attendees, and companies",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export default swaggerDefinition;

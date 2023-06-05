import { type SwaggerOptions } from "swagger-ui-express";

export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node S15",
      version: "1.0.0",
      description: "This is a simple CRUD API of books",
      license: {
        name: "MIT",
        url: "http://mit.com",
      },
      contact: {
        name: "Daniel Ruiz",
        url: "https://github.com/daniruiz",
        email: "dani@example.com"
      }
    },
    server: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: [
    "./src/models/*.ts",
    "./src/routes/*.ts",
  ]
};

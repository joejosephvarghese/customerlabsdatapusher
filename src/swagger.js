const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Swagger definition
const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation For Ailoitte Node js Mechine Test',
    version: '1.0.0',
    description: `**Ecommerce Application** built with Node.js and Express.
    
    This API offers various endpoints to manage products, users, orders, and carts.
    Features include:

    - **JWT Authentication** for secure access.
    - **Error handling** with custom responses.
    - **RESTful APIs** designed for scalability.
    - **Cloudinary image upload** for managing product images.
    - **Pagination** support for result listing.
    - **Filters and search** functionality for querying products and orders.
    - **PostgreSQL** database for persistent data storage.
    
    All responses are formatted in JSON. For more details on the available endpoints, please refer to the detailed documentation below.`
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Indicating the use of JWT
      },
    },
  },
  security: [{ bearerAuth: [] }], // Ensuring that security is applied globally
  servers: [{ url: "http://localhost:3000/v1" }], // Update base URL as needed
  tags: [
    { name: "Authentication", description: "APIs related to user authentication and registration" },
    { name: "Products", description: "APIs for product management, including image upload and search" },
    { name: "Orders", description: "APIs for placing and managing orders" },
    { name: "Cart", description: "APIs related to cart management" },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition: swaggerOptions, // Use 'swaggerOptions' here
  apis: [path.join(__dirname, "../src/routes/v1/**/*.js")], // Scan all route files
};

// Generate Swagger spec
const swaggerSpec = swaggerJSDoc(options);

// Setup Swagger UI middleware
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger Docs available at: http://localhost:3000/api-docs");
};

module.exports = setupSwagger;

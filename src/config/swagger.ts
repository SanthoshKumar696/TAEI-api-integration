import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Triage API",
      version: "1.0.0",
      description: "ABHA and clinical API documentation"
    },
    servers: [
      { url: "http://localhost:5000" }
    ],
    tags: [
      { name: "ABHA", description: "ABHA mobile search, OTP and verification APIs" }
    ],
    components: {
      schemas: {
        StemiAdmission: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            triage_id: { type: "integer", example: 101 },
            is_admitted: { type: "boolean", example: true },
            date_time_entry: {
              type: "string",
              format: "date-time",
              example: "2025-09-01T10:30:00Z",
            },
            department_name: { type: "string", example: "Cardiology" },
            date_time_admission: {
              type: "string",
              format: "date-time",
              example: "2025-09-01T12:00:00Z",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"],
});

export const setupSwagger = (app: Express) => {
  app.get("/api-docs.json", (_req, res) => {
    res.json(specs);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: "Triage API Documentation"
  }));
};

export { specs };
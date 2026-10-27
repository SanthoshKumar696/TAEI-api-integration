import express from 'express';
import triageRoutes from './routes/TriageRoutes';
import emoTriageRoutes from './routes/EmoTriageRoutes';
import { sequelize } from './config/db';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import traumaRoutes from './routes/TraumaRoutes';
import burnsRoutes from './routes/BurnsRoutes';
import poisonsRoutes from './routes/PoisonsRoutes';
import BitesStingsRoutes from './routes/BitesStingsRoutes';
import HangingRoutes from './routes/HangingRoutes';
import StrokeRoutes from './routes/StrokeRoutes';
import PremRoutes from './routes/PremRoutes';
import cors from 'cors';
import Routes from './routes/Routes';
import TransitCareSunc from './routes/TransitCareSyncRoute';
import { requestTimer } from './utils/requestTimer';
import path from 'path';
import { formatDatesInResponse } from './utils/formatDateToLocalString';
import { runDbScripts } from './utils/runDbScripts';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
const app = express();

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    formatDatesInResponse(body); // mutates in place, no structure change
    return originalJson(body);
  };
  next();
});


// const allowedOrigins = process.env.CORS_ORIGINS?.split(',');

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins?.indexOf(origin) === -1) {
//       const msg = `CORS policy does not allow access from origin: ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true, // if using cookies or auth headers
// }));

// Allow all origins, methods, and headers
app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // allow all common methods
  allowedHeaders: ['*'],//["Content-Type", "Authorization"], // allow headers for JSON + Token
}));

// Optional: handle preflight (for browsers)
app.options("*", cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(requestTimer);

// this common one will be secured for all end points based on the user permission it will work
app.use('/api', Routes);
app.use('/API108', TransitCareSunc);



// this is used to check server is running or not by load balancer or health checkers
app.get('/', (req, res) => {
  res.status(200).send('OK');
})
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/app', (req, res) => {
  return res.send('Imman Kirithika')
})
// below all open access in some case if you want to use API without toke use below and comment common routes
// app.use('/api', triageRoutes);
// app.use('/api', emoTriageRoutes);
// app.use('/api', traumaRoutes);
// app.use('/api', burnsRoutes);
// app.use('/api', poisonsRoutes);
// app.use('/api', BitesStingsRoutes);
// app.use('/api', HangingRoutes);
// app.use('/api', StrokeRoutes);
// app.use('/api', PremRoutes);

setupSwagger(app);
/*
 sequelize.authenticate()
   .then(() => console.log('Database connected'))
   .catch(err => console.error('Unable to connect to DB:', err));
*/




/* ================================
   DATABASE CONNECTION
================================ */

async function startServer() {

  try {

    console.log("Connecting to database:", process.env.DB_NAME);

    await sequelize.authenticate();

    console.log("Database connected successfully");

    /* ================================
       RUN ALL SQL SCRIPTS
    ================================= */

    // await runDbScripts();

    /* ================================
       START SERVER
    ================================= */

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    /* ================================
       GRACEFUL SHUTDOWN
    ================================= */

    process.on("SIGTERM", async () => {

      console.log("SIGTERM received. Closing DB connection...");

      await sequelize.close();

      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });

    });

    process.on("SIGINT", async () => {

      console.log("SIGINT received. Closing DB connection...");

      await sequelize.close();

      server.close(() => {
        process.exit(0);
      });

    });

  }

  catch (error) {

    console.error("Database connection failed:", error);
    process.exit(1);

  }

}

startServer();
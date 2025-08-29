// Import the framework and instantiate it
import Fastify from 'fastify';
import { db } from "./db.js";
import cors from '@fastify/cors';

// Import routes
import { authRoutes } from './routes/authRoutes.js';
import { tasksRoutes } from './routes/tasksRoutes.js';

const app = Fastify();

// Register CORS
await app.register(cors, {
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
});

// Register routes
await app.register(authRoutes);
await app.register(tasksRoutes);

// Health check route
app.get("/", async (request, reply) => {
  // testar consulta
  const [rows] = await db.query("SELECT NOW() as now");
  return { message: "Conexão com MySQL funcionando 🚀", time: rows[0].now };
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
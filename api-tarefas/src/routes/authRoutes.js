import { authController } from "../controllers/authController.js";

export async function authRoutes(fastify, options) {
  // Rota de registro
  fastify.post("/auth/register", authController.register);

  // Rota de login
  fastify.post("/auth/login", authController.login);
}
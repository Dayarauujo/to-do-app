import { tasksController } from "../controllers/tasksController.js";
import { authenticate } from "../middleware/auth.js";

export async function tasksRoutes(fastify, options) {
  // Listar todas as tarefas do usuário logado
  fastify.get("/tasks", { preHandler: [authenticate] }, tasksController.getTasks);

  // Criar uma nova tarefa
  fastify.post("/tasks", { preHandler: [authenticate] }, tasksController.createTask);

  // Atualizar uma tarefa
  fastify.put("/tasks/:id", { preHandler: [authenticate] }, tasksController.updateTask);

  // Excluir uma tarefa
  fastify.delete("/tasks/:id", { preHandler: [authenticate] }, tasksController.deleteTask);

  // Alternar status da tarefa
  fastify.patch("/tasks/:id/toggle", { preHandler: [authenticate] }, tasksController.toggleTask);
}
import { db } from "../db.js";

export const tasksController = {
  // Listar todas as tarefas do usuário logado
  async getTasks(request, reply) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM tasks WHERE user_id = ?",
        [request.user.id]
      );
      return rows;
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro ao buscar tarefas" });
    }
  },

  // Criar uma nova tarefa
  async createTask(request, reply) {
    const { title, description } = request.body;

    if (!title) {
      return reply.status(400).send({ error: "Título é obrigatório" });
    }

    try {
      const [result] = await db.query(
        "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
        [title, description || "", request.user.id]
      );

      return reply.status(201).send({ 
        id: result.insertId, 
        title, 
        description, 
        completed: false 
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro ao criar tarefa" });
    }
  },

  // Atualizar uma tarefa
  async updateTask(request, reply) {
    const { id } = request.params;
    const { text, title, description, completed } = request.body;

    // Aceitar tanto "text" quanto "title"
    const taskTitle = text || title;
    
    if (!taskTitle) {
      return reply.status(400).send({ error: "Texto da tarefa é obrigatório" });
    }

    try {
      // Buscar tarefa atual para manter campos não informados
      const [currentTask] = await db.query(
        "SELECT title, description, completed FROM tasks WHERE id = ? AND user_id = ?",
        [id, request.user.id]
      );

      if (currentTask.length === 0) {
        return reply.status(404).send({ error: "Tarefa não encontrada ou sem permissão" });
      }

      const current = currentTask[0];
      
      // Usar valores atuais se não foram informados
      const finalDescription = description !== undefined ? description : current.description;
      const finalCompleted = completed !== undefined ? completed : current.completed;

      // Atualizar no banco
      const [result] = await db.query(
        "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?",
        [
          taskTitle,
          finalDescription || "",
          finalCompleted ? 1 : 0,
          id,
          request.user.id
        ]
      );

      if (result.affectedRows === 0) {
        return reply.status(404).send({ error: "Tarefa não encontrada ou sem permissão" });
      }

      // Retornar tarefa atualizada no formato que o frontend espera
      return { 
        id: parseInt(id),
        title: taskTitle,
        completed: Boolean(finalCompleted)
      };
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro ao atualizar tarefa" });
    }
  },

  // Excluir uma tarefa
  async deleteTask(request, reply) {
    const { id } = request.params;

    try {
      const [result] = await db.query(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        [id, request.user.id]
      );

      if (result.affectedRows === 0) {
        return reply.status(404).send({ error: "Tarefa não encontrada ou sem permissão" });
      }

      // Retornar status 200 com mensagem de sucesso
      return reply.status(200).send({ message: "Tarefa excluída com sucesso" });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro ao excluir tarefa" });
    }
  },

  // Alternar status da tarefa (concluída/pendente)
  async toggleTask(request, reply) {
    const { id } = request.params;

    try {
      // buscar tarefa atual
      const [rows] = await db.query(
        "SELECT id, title, completed FROM tasks WHERE id = ? AND user_id = ?",
        [id, request.user.id]
      );

      if (rows.length === 0) {
        return reply.status(404).send({ error: "Tarefa não encontrada" });
      }

      const task = rows[0];
      const newCompleted = task.completed ? 0 : 1;

      // atualizar no banco
      await db.query(
        "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
        [newCompleted, id, request.user.id]
      );

      // retornar a tarefa atualizada no formato que o frontend espera
      return {
        id: task.id,
        title: task.title,
        completed: Boolean(newCompleted)
      };
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro ao atualizar tarefa" });
    }
  }
};
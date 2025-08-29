import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "chave_super_secreta";

export const authController = {
  // Registrar usuário
  async register(request, reply) {
    const { username, password } = request.body;

    // validação simples
    if (!username || !password) {
      return reply.status(400).send({ error: "Username e password são obrigatórios" });
    }

    try {
      // verificar se já existe usuário
      const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
      if (existing.length > 0) {
        return reply.status(400).send({ error: "Usuário já existe" });
      }

      // criptografar senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // salvar no banco
      await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        hashedPassword,
      ]);

      return reply.status(201).send({ message: "Usuário registrado com sucesso 🚀" });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro no servidor" });
    }
  },

  // Login do usuário
  async login(request, reply) {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.status(400).send({ error: "Username e password são obrigatórios" });
    }

    try {
      // buscar usuário no banco
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
      if (rows.length === 0) {
        return reply.status(400).send({ error: "Usuário não encontrado" });
      }

      const user = rows[0];

      // comparar senha enviada com a salva no banco
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return reply.status(401).send({ error: "Senha incorreta" });
      }

      // gerar token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "1h" }
      );

      return reply.send({ message: "Login realizado com sucesso 🚀", token });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro no servidor" });
    }
  }
};
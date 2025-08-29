import jwt from "jsonwebtoken";

const SECRET = "chave_super_secreta";

// Middleware de autenticação
export async function authenticate(request, reply) {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }

    // O header vem assim: "Bearer token_aqui"
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET);

    // Salva as infos do usuário no request
    request.user = decoded;
  } catch (err) {
    console.error(err);
    return reply.status(401).send({ error: "Token inválido ou expirado" });
  }
}
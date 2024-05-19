const Fastify = require("fastify");
const WebSocket = require("ws");
const path = require("path");

const app = Fastify();

// Servir archivos estáticos desde la carpeta 'public'
app.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// Crear un servidor HTTP
const server = require("http").createServer(app.server);

// Crear una instancia de WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Escuchar mensajes del cliente
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Enviar mensaje de vuelta a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Manejar la desconexión del cliente
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

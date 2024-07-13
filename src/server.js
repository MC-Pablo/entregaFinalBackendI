import express from "express";
import paths from "./utils/paths.js";
import mongoDB from "./config/mongoose.config.js";
import handlebars from "./config/handlebars.config.js";
import appStudentsRouter from "./routes/app.students.router.js";
import apiStudentsRouter from "./routes/api.students.router.js";
import { ERROR_SERVER, ERROR_NOT_FOUND_URL } from "./constants/messages.constant.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Configuración del motor de plantillas
handlebars.config(server);

// Declaración de ruta estática: http://localhost:8080/api/public
server.use("/public", express.static(paths.public));

// Definición de enrutadores
server.use("/students", appStudentsRouter);
server.use("/api/students", apiStudentsRouter);

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(500).send(`<h1>Error 404</h1><h3>${ERROR_NOT_FOUND_URL.message}</h3>`);
});

// Control de errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER.message}</h3>`);
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});
// src/app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import roomsRouter from "./routes/rooms.js";
import messagesRouter from "./routes/messages.js";

const app = express();

// нужно, чтобы корректно получить __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// парсим JSON из запросов
app.use(express.json());

// раздаём статику (public/index.html и т.п.)
app.use(express.static(path.join(__dirname, "..", "public")));

// наши API-роуты
app.use("/api/rooms", roomsRouter);
app.use("/api/messages", messagesRouter);

export default app;

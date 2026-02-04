import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoCompleted,
  updateTodo,
} from "../controllers/todo.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const todoRouter = Router();

todoRouter.post("/", auth, createTodo);
todoRouter.get("/", auth, getTodos);
todoRouter.put("/:id", auth, updateTodo);
todoRouter.delete("/:id", auth, deleteTodo);
todoRouter.patch("/:id/toggle", auth, toggleTodoCompleted);

export default todoRouter;

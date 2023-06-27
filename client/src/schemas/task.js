// Validador de esquema de tarea con Zod
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
}); // El esquema que requere ser enviado para crear, actualizar o eliminar una tarea => Si no lo cumple retorna un mensaje de error

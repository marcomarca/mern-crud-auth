// Validar el formulario de registro y login con Zod => Se requiere la validacion por el frontend debido a ofrecer una respuesta mas rapida al usuario
import { z } from "zod";

// Si el usuario NO cumple con el schema, retorna un mensaje de error
export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

// Para que el usuario se pueda registrar, debe cumplir con el schema
export const registerSchema = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(3, {
        message: "Username must be at least 3 characters",
      }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", // message => Cuando el usuario no confirma correctamente su contraseña
    path: ["confirmPassword"], // pregunta: que hace path? => path => Especifica el campo que se va a validar => En este caso es el campo confirmPassword
  }); // refine => Verifica que los datos enviados cumplan con el schema => En este caso esto se encarga de validar que el password y confirmPassword sean iguales

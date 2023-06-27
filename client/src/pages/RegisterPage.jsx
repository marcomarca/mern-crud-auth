import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { TasksPage } from "./TasksPage";

// Register es el componente principal y unico de la pagina RegisterPage
function Register() {
  // Cuando el componente RegisterPage es llamado por primera vez ejecuta:

  // 1. Llamara a las funciones y estados de `useAuth` para poder usarlos en este componente, las mismas estan fuertemente relacionadas con el contexto de autenticacion.
  const {
    signup, // Funcion que se encarga de registrar un usuario en la base de datos.
    errors: registerErrors, // Errores que se generan al registrar un usuario en la base de datos. | // errors se importa como registerErrors para evitar conflictos con el componente Message que tambien tiene un estado llamado errors.
    isAuthenticated,
  } = useAuth(); // useAuth es el hook que habilita el contexto de autenticacion en este componente. Pone el Switch ON para que este componente pueda acceder a las funciones y estados del contexto `AuthContext`.

  const {
    // Conjunto de propiedades que devuelve useForm
    register, // Encapsula los inputs del formulario y con ayuda de zod los valida.
    handleSubmit, // Para validar el formulario cuando se envia
    formState: { errors }, // errors es un objeto que contiene todos los errores de los inputs del formulario.
  } = useForm({
    // useForm recibe un objeto con las propiedades que necesita para funcionar.
    resolver: zodResolver(registerSchema), // zodResolver es el conector entre useForm y zod. => zod es el encargado de validar los inputs del formulario.
  }); // useForm y zod trabajan juntos para validar los inputs del formulario.

  const navigate = useNavigate(); // Instanciamos el hook useNavigate para poder redirigir al usuario a otra ruta, una vez que se haya registrado.

  const onSubmit = async (value) => {
    await signup(value);
  }; // esta funcion solo correra cuando el formulario sea valido y en ningun otro momento. => En ningun otro momento.

  // Recordemos que signup cambiara el estado de `isAuthenticated`, y por ende, cuando termine de correr, se ejecutara el useEffect.

  // Este codigo se ejecuta solamente cuando la variable `isAuthenticated` cambia de valor. => No se ejecutara en la primera renderizacion del componente. => Ni en ningun otro momento.
  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]); // Cuando se llama a este componente => se ejecuta el useEffect => se ejecuta el navigate => se redirige a la ruta "/tasks"

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {/* // Duda: para que queremos imprimir los errores en el frontend, referentes al authContext? => Respuesta: Para que el usuario sepa que esta pasando. */}
        {registerErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        {/* TITULO */}
        <h1 className="text-3xl font-bold">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Primer input USERNAME */}
          <Label htmlFor="username">Username:</Label>
          <Input
            type="text"
            name="username"
            placeholder="Write your name" // El texto que aparece dentro del input
            {...register("username")}
            autoFocus // el cursor se posiciona en el input => Directo para escribir
          />
          {/* Generera texto color ROJO de ERROR de input USERNAME => recordemos que `?` es el `optional chaining operator` => Que se encarga de evaluar si existe `message` => Si no existiese entonces `errors.username` seria `undefined` => Por ende toda la expresion seria `falsy` y la evaluacion seria `false` => && no ejecutaria el codigo de la derecha.
           */}
          {errors.username?.message && (
            <p className="text-red-500">{errors.username?.message}</p>
          )}
          {/* Segundo input EMAIL */}
          <Label htmlFor="email">Email:</Label>
          <Input
            name="email"
            placeholder="youremail@domain.tld"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-red-500">{errors.email?.message}</p>
          )}

          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            name="password"
            placeholder="********"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-red-500">{errors.password?.message}</p>
          )}

          <Label htmlFor="confirmPassword">Confirm Password:</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="********"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="text-red-500">{errors.confirmPassword?.message}</p>
          )}
          <Button>Submit</Button>
        </form>
        <p>
          Already Have an Account?
          <Link className="text-sky-500" to="/login">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;

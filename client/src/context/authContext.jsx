import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie"; // js-cookie es una libreria que nos permite crear, leer y eliminar cookies

const AuthContext = createContext(); // crea un contexto | Mira que no esta encapsulado en una funcion, lo que significa que linea de codigo, correra cada vez que se importe este archivo `authContext.jsx`

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
}; // Hook que retorna el contexto `AuthContext` => Con esta funcion no sea necesario que importemos el contexto y useContext en cada componente que lo necesite => Pues tan solo necesitamos importar el Hook `useAuth` y listo
// Este useAuth funciona como una caja negra => Cuando lo necesitamos, simplemente lo importamos y listo, pues todas las dependencias que necesite esta funcion, ya correran dentro de authContext, sin necesidad de entender como funciona

// AuthProvider => Componente que provee el contexto `AuthContext` => Este componente debe ser el padre de todos los componentes que necesiten acceder a este contexto
export const AuthProvider = ({ children }) => {
  // En que lugar se conecta AuthProvider con AuthContext => En el archivo `main.jsx` => Pues AuthProvider debe ser el padre de todos los componentes que necesiten acceder a este contexto

  const [user, setUser] = useState(null); // useState: Al detectar un cambio en el estado de `user`, actualiza todo el componente, haciendo correr nuevamente la funcion AuthProvider | contexto del usuario => Si el usuario esta logueado, este contexto tendra la informacion del usuario, de lo contrario, sera null
  const [isAuthenticated, setIsAuthenticated] = useState(false); // contexto que indica si el usuario esta logueado o no
  const [errors, setErrors] = useState([]); // contexto que contiene los errores que se generen en el servidor => Si no hay errores, este contexto sera un array vacio => Pero estos errores los devuelve el servidor por medio de la respuesta de la solicitud `res` => Almacenado de la forma `res.response.data.message` => Debe ser [] porque el servidor puede devolver mas de un error => Ademas si usamos `map` para mostrar los errores en el formulario de registro, no podemos usar `map` en un objeto, solo en un array
  const [loading, setLoading] = useState(true); // contexto que indica si la aplicacion esta cargando o no => Esto es util para mostrar un spinner mientras la aplicacion carga => Un spinner es un icono de carga => Es muy util para informar al usuario que la aplicacion esta cargando y no se ha quedado congelada

  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]); // Vacia al array de errores despues de 5 segundos
      }, 5000);
      return () => clearTimeout(timer); // clearTimeout => funcion que cancela el setTimeout, para dejarlo como estaba antes de ejecutarlo
    }
  }, [errors]); // useEffect => Hook que se ejecuta cada vez que el componente se renderiza => En este caso, cada vez que el componente se renderiza, se ejecuta este hook => Este hook se ejecuta cada vez que el estado `errors` cambia => Si el estado `errors` cambia, se ejecuta el hook y se limpia el estado `errors` despues de 5 segundos

  const signup = async (user) => {
    try {
      const res = await registerRequest(user); // Envia la solicitud de registro al servidor => `res` es un objeto que viene de la respuestas del servidor => Bien es sabido que tendra una propiedad `status` y `data`.
      if (res.status === 200) {
        setUser(res.data); // Se guarda en el contexto `user` la informacion del usuario
        setIsAuthenticated(true); // Se cambia el estado `isAuthenticated` a true
      }
    } catch (error) {
      // recordermos que el objeto `error` viene de la respuesta del servidor, cuando se realiza la consulta registerRequest(user) => Por ende, `error` contiene los errores que encontro el servidor al momento de registrar al usuario => Es aqui donde podemos extraer la informacion especifica de los errores e imprimirlos en el frontend => Para esto, hay que saber cual es la forma de la estructura que nos envia el servidor para guardar los errores en el contexto de authContext.
      console.log(error.response.data);
      setErrors(error.response.data.message); // Se guarda en el contexto `errors` los errores que se generen en el servidor => Esto es con el fin de mostrar los errores al usuario en el formulario de registro => Si no hay errores, este contexto sera un array vacio
    }
  }; // Solicitud de signup al servidor

  const signin = async (user) => {
    try {
      const res = await loginRequest(user); // Envia la solicitud de login al servidor
      setUser(res.data); // Se guarda en el contexto `user` la informacion del usuario
      setIsAuthenticated(true); // Se cambia el estado `isAuthenticated` a true
    } catch (error) {
      console.log(error);
      // setErrors(error.response.data.message);
    }
  }; // Solicitud de signin al servidor

  const logout = () => {
    Cookies.remove("token"); // Elimina la cookie `token` del navegador
    setUser(null); // Vacia el contexto `user`
    setIsAuthenticated(false); // Cambia el estado `isAuthenticated` a false
  }; // Funcion que cierra la sesion del usuario => Esta funcion se ejecuta cuando el usuario hace click en el boton de logout => Entonces cuando el usuario intente ingresar a su perfil o cualquier otra ruta que requiera autenticacion, sera redirigido al login

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []); // useEffect que solo corre una sola vez =>

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  ); // Aqui estan la lista de las funciones y estados que se pueden acceder desde cualquier componente que este dentro de AuthProvider. La unica condicion es que el componente que quiera acceder a estos estados y funciones, debe importar el Hook `useAuth`
}; // Este contexto, por el simple hecho de existir jerarquicamente arriba de los componentes que lo necesitan, ya puede ser accedido por todos los componentes que esten dentro de AuthProvider. => Pero para acceder hay que activarlo con useAuth, que lo enciende, y recien se puede trabajar con el.

export default AuthContext;

/*
    ╔══════════════════╗       ╔══════════════════╗
    ║   Componente A   ║       ║   Componente B   ║
    ║                  ║       ║                  ║
    ║   ╔════════════╗ ║       ║   ╔════════════╗ ║
    ║   ║            ║ ║       ║   ║            ║ ║
    ║   ║  Contexto  ║<╬═══════╬>  ║  Contexto  ║ ║
    ║   ║            ║ ║       ║   ║            ║ ║
    ║   ║            ║<╬═══════╬>  ║            ║ ║
    ║   ╚════════════╝ ║       ║   ╚════════════╝ ║
    ║                  ║       ║                  ║
    ╚══════════════════╝       ╚══════════════════╝
*/

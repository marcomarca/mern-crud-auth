import { Link } from "react-router-dom";

// HomePage => Solo crea una sertion TAG, que contiene un header TAG `TITULO` y un parrafo TAG `DESCRIPCION` y un Link TAG `BOTON`
// Este componente no se relaciona con el NAVBAR
function HomePage() {
  return (
    <section className="bg-red-500 flex justify-center items-center">
      <header className="bg-zinc-800 p-10">
        <h1 className="text-5xl py-2 font-bold">React Tasks</h1>
        <p className="text-md text-slate-400">
          ¡Bienvenido a nuestra increíble aplicación de React para guardar tus
          notas! Permíteme describirte lo maravilloso que es utilizar esta
          aplicación y cómo puede mejorar tu vida diaria. Imagina un mundo en el
          que nunca más olvides tus ideas, tareas importantes o momentos
          especiales. Nuestra aplicación de notas en React te permite capturar
          todos esos pensamientos fugaces y mantenerlos organizados en un solo
          lugar. Es como tener un asistente personal siempre a tu disposición.
          Con nuestra interfaz intuitiva y atractiva, tomar notas se convierte
          en una experiencia placentera. Puedes escribir, editar y dar formato a
          tus notas de manera rápida y sencilla. Además, puedes crear categorías
          personalizadas para organizar tus pensamientos por temas o proyectos,
          lo que facilita la búsqueda y el acceso a la información que necesitas
          en cualquier momento. Pero eso no es todo. Nuestra aplicación de notas
          en React ofrece funciones avanzadas, como la capacidad de adjuntar
          imágenes y archivos a tus notas, recordatorios para no olvidar fechas
          importantes y la posibilidad de sincronizar tus notas en todos tus
          dispositivos para acceder a ellas desde cualquier lugar. Además, con
          la seguridad de tus datos como nuestra máxima prioridad, puedes estar
          tranquilo sabiendo que tus notas están protegidas y respaldadas de
          forma segura en nuestros servidores. En resumen, nuestra aplicación de
          notas en React es tu compañero perfecto para mantener tu vida
          organizada y productiva. ¡No esperes más para descubrir la maravilla
          de utilizar esta aplicación!
        </p>
        <Link
          className="bg-zinc-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
          to="/register"
        >
          Get Started
        </Link>
        {/* Link TAG => que apunta a la ruta /register
         */}
      </header>
    </section>
  );
}

export default HomePage;

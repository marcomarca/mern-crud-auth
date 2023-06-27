import { createContext, useContext, useState } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
}; // Para cargar el contexto en cualquier componente

// Esta es la funcion principal de contexto => Se cargara cada vez que se cargue el componente => Lo que significa, que cuando algun componente quiera usar el contexto, se cargara esta funcion en su respectivo orden:
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]); // 1ro: Estado inicial de las tareas

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.log(`Error generado en getTasks: ${error}`); // Colocar un comentario y el error, sirve para saber en que parte del codigo se genero el error
    }
  }; // Funcion que se instancia pero no se ejecuta todavia.

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id)); // 204 => No hay contenido, pero la solicitud se ejecuto correctamente
    } catch (error) {
      console.log(`Error generaro en deleteTask: ${error}`);
    }
  }; //

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      console.log(res.data);
    } catch (error) {
      console.log(`Error generado en createTask: ${error}`);
    }
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(`Error generado en getTask: ${error}`);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTaskRequest(id, task);
    } catch (error) {
      console.error(`Error generado en updateTask: ${error}`);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
/*
Imagina que el contexto taskContext.jsx es como un restaurante de comida rápida. En el restaurante, hay una persona muy especial llamada "Contexto" que está a cargo de todas las tareas importantes.

El "Contexto" tiene varias funciones empaquetadas que son como las diferentes áreas del restaurante. Por ejemplo, tenemos la función "crearTarea" que es como la cocina del restaurante donde se preparan los alimentos. La función "leerTarea" es como el menú del restaurante, donde podemos leer y ver las diferentes opciones de tareas disponibles. La función "actualizarTarea" es como el mostrador de pedidos, donde podemos cambiar los detalles de una tarea si es necesario. Y la función "eliminarTarea" es como el área de limpieza, donde podemos borrar una tarea que ya no necesitamos.

Además, el "Contexto" también tiene una especie de libreta mágica llamada "estado" donde se guarda toda la información importante sobre las tareas. Esta libreta se parece a un gran tablero en el que se anotan todas las tareas que los clientes piden.

Cuando necesitamos hacer algo con una tarea, como crear, leer, actualizar o eliminar, vamos al "Contexto" y le decimos qué tarea queremos hacer y cómo queremos hacerlo. Por ejemplo, si queremos crear una nueva tarea, le decimos al "Contexto" qué tipo de tarea queremos y qué detalles debe tener, y el "Contexto" se encarga de prepararla en la cocina (usando la función "crearTarea") y la anota en la libreta mágica (actualizando el "estado").*/

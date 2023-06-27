import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFound = await User.findOne({ email }); // User es el modelo de la base de datos (user.model.js)

    if (userFound)
      return res.status(400).json({
        message: ["The email is already in use"],
      }); // Si useFound existe, significa que el email ya está en uso en la base de datos

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    }); // User es el modelo de la base de datos (user.model.js) => se guardaran en el objeto newUser

    // saving the user in the database
    const userSaved = await newUser.save(); //  newUser.save() => basado en el objeto newUser, se guardará en la base de datos y tambien se guardará en userSaved

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    }); // Basado en el ID del usuario recien creado, se creará un token => se guardará en `token`

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development", // Si estamos en desarrollo, no se usará httpOnly => Si estamos en producción, la cookie solo se podrá acceder desde el servidor => El cliente no podra modificar la cookie con javascript o desde el navegador | process.env.NODE_ENV almacena el entorno de ejecución actual ('development', 'production', etc)
      secure: true, // Si estamos en desarrollo, no se usará secure => Si estamos en producción, la cookie solo se enviará en HTTPS
      sameSite: "none", // Si estamos en desarrollo, no se usará sameSite => Si estamos en produccion, la cookie se podra enviar desde un sitio externo => sameSite puede tener 3 valores: 'strict', 'lax', 'none' => 'strict' => la cookie solo se enviará en una peticion del mismo sitio => 'lax' => la cookie se enviará en una peticion del mismo sitio o en una peticion de un sitio externo, pero solo si la peticion es un GET => 'none' => la cookie se enviará en una peticion del mismo sitio o en una peticion de un sitio externo
    }); // Se genera una cookie para el cliente, con el token generado =>

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    }); // Se enviará un json con los datos del usuario recien creado
  } catch (error) {
    res.status(500).json({ message: error.message });
  } // Si se puede enviar res.cookie y res.json en una sola solicitud, pues aunque express solo permita enviar una sola respuesta, el navegador puede recibir el establecimiento de cookies y el json en una sola solicitud
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["The email does not exist"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    // Crea un nuevo token, basado en el ID y el username del usuario encontrado
    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username, // [] duda: porque se envia el username en el token tambien? => Respuesta: para que el cliente pueda acceder al username sin tener que hacer una peticion al servidor, ya que el username se puede obtener desde el token | Al generar un nuevo token, se puede enviar cualquier dato que se quiera, pero se recomienda enviar solo datos que no sean sensibles
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true, // La cookie solo se enviará en HTTPS | Cambiar a `secure: process.env.NODE_ENV !== "development"` en produccion
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401); // 401 => Unauthorized

    const userFound = await User.findById(user.id); // En mongoDB .id y ._id son lo mismo
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    // Se establece una cookie vacia
    httpOnly: true, // La cookie solo se podrá acceder desde el servidor, debido que al hacer logout, el token ya no es necesario en el cliente
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

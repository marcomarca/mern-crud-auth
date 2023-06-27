import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies; // verificamos el token actual

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" }); // si no hay token, no hay autorizacion

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" }); // si el token no es valido, no hay autorizacion
      }
      req.user = user; // si el token es valido, guardamos el usuario en el req para usarlo en los controladores =>
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; // auth => Verificar si el usuario esta logueado o no

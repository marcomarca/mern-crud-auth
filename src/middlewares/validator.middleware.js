// valitateSchema =>
export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // parse => Verifica que los datos enviados cumplan con el schema
    next();
  } catch (error) {
    return res
      .status(400) // 400 => Bad Request
      .json({ message: error.errors.map((error) => error.message) }); // Si no cumple con el schema, retorna un mensaje de error
  }
};

import { connect, Types } from "mongoose";

const connectDB = () => {
    const URI = "mongodb+srv://pablomconturso:RnSfRNnwLMnqLlvQ@proyectobackendcoderhou.i5ax0kq.mongodb.net/";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "e-commerce", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((error) => console.error("Error al conectar con MongoDB", error));

};

const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

export default {
    connectDB,
    isValidID,
};
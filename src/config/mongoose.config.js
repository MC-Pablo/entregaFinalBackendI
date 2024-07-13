import { connect, Types } from "mongoose";

const connectDB = () => {
    const URI = "mongodb+srv://sergio:Y2aiTV3letzbtqiV@cluster0.4i0l5oa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "university", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));

};

const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

export default {
    connectDB,
    isValidID,
};
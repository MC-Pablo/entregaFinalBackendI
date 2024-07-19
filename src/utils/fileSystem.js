import fs from "fs";
import path from "path";

export default class FileSystem {
    read = async (filepath, filename) => {
        if (!filepath) throw new Error("Lectura. No has enviado la ruta del archivo");
        if (!filename) throw new Error("Lectura. No has enviado el nombre del archivo");

        const content = await fs.promises.readFile(path.join(filepath, filename));
        return content;
    };

    write = async (filepath, filename, content) => {
        if (!filepath) throw new Error("Escritura. No has enviado la ruta del archivo");
        if (!filename) throw new Error("Escritura. No has enviado el nombre del archivo");
        if (!content) throw new Error("Escritura. No has enviado contenido");

        return await fs.promises.writeFile(path.join(filepath, filename), content);
    };

    delete = async (filepath, filename) => {
        if (!filepath) throw new Error("Eliminación. No has enviado la ruta del archivo");
        if (!filename) throw new Error("Eliminación. No has enviado el nombre del archivo");

        try {
            return await fs.promises.unlink(path.join(filepath, filename));
        } catch (error) {
            console.log("Eliminación. No existe el archivo");
        }
    };
}
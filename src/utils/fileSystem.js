import fs from "fs";
import paths from "./paths.js";

const deleteImage = async (filename) => {
    const filepath = `${paths.images}/${filename}`;

    try {
        await fs.promises.unlink(filepath);
    } catch (error) {
        console.log(`No existe el archivo ${filename}`);
    }
};

export default {
    deleteImage,
};
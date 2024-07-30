/* Servidor */
import { Server } from "socket.io";
import ProductManager from "../managers/ProductsManager.js";

const productsManager = new ProductManager();

const socketConfig = (serverHTTP) => {
    const serverIo = new Server(serverHTTP);
    serverIo.on("connection", async (socket) => {
        const id = socket.client.id;
        console.log("Conexion establecida", id);

        try {
            const products = await productsManager.getAll();
            socket.emit("products", products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            socket.emit("productsError", { message: "Error al obtener productos" });
        }

        socket.on("add-product", async (product) => {
            console.log(product);
            try {
                await productsManager.addProduct({ ...product });
                socket.emit("products", await productsManager.getProducts());
            } catch (error) {
                console.error("Error al agregar producto:", error);
                socket.emit("productsError", { message: "Error al agregar producto" });
            }
        });

        socket.on("delete-product", async (id) => {
            console.log(id);
            try {
                await productsManager.deleteProductById(id);
                const updatedProducts = await productsManager.getProducts();
                socket.emit("products", updatedProducts);
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                socket.emit("productsError", { message: "Error al eliminar producto" });
            }
        });

    
        socket.on("disconnect", () => {
            console.log("Se desconecto un Cliente");
        });
    });
};

export default { socketConfig };
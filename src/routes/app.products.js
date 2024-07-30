import { Router } from "express";
import ProductManager from "../managers/ProductsManagers.js"

const appProductsRouter = Router();

const productsManager = new ProductManager();


appProductsRouter.get("/", async (req, res) => {
    try {
        const allProducts = await productsManager.getAll(req.query);
        console.log(allProducts)
        return res.status(200).render("products", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

appProductsRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productsManager.getOneById(id);
        console.log(product)
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        return res.status(200).render("productDetail", { title: "Product Detail", product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Hubo un error en el servidor");
    }
});


export default appProductsRouter;
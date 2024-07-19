import { Router } from "express";
import ProductManager from "../managers/ProductsManagers.js"

const apiProductsRouter = Router();
const PRODUCT = new ProductManager();


apiProductsRouter.get("/", async (req, res) => {
    try {
        const products = await PRODUCT.getAll(req.query);
        return res.status(200).json({ status: true, payload: products });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

apiProductsRouter.get("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await PRODUCT.getOneByIdById(ID);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });

    }
});

apiProductsRouter.post("/", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const productCreated = await productManager.insertOne(req.body, file?.filename);
        res.status(201).json({ status: true, payload: ingredientCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiProductsRouter.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const productUpdated = await PRODUCT.updateOneById(req.params.id, req.body, file?.filename);
        res.status(200).json({ status: true, payload: ingredientUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiProductsRouter.delete("/:id", async (req, res) => {
    try {
        const ID = (req.params.id);
        const product = await PRODUCT.deleteOneById(ID);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});


export default apiProductsRouter;
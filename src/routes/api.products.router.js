import { Router } from "express";
import ProductManager from "../managers/ProductsManagers.js";

const apiProductsRouter = Router();
const apiProductsManager = new ProductManager();

apiProductsRouter.get("/", async (req, res) => {
  try {
    const products = await apiProductsManager.getAll(req.query);
    return res.status(200).json({ status: true, payload: products });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiProductsRouter.get("/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const product = await apiProductsManager.getOneById(ID);
    res.status(200).json({ status: true, payload: product });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiProductsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await apiProductsManager.deleteOneById(id);
    res.status(200).json({ status: true, payload: product });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiProductsRouter.post("/", async (req, res) => {
  try {
    const { category, name, description, price, thumbnail, stock, brand } = req.body;
    const product = await apiProductsManager.addProduct({
      category,
      name,
      description,
      price,
      thumbnail,
      stock,
      brand,
    });
    res.status(201).json({ status: true, payload: product });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiProductsRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { category, name, description, price, thumbnail, stock, brand } = req.body;
    const updateData = { category, name, description, price, thumbnail, stock, brand };
    const productUpdated = await apiProductsManager.updateProduct(
      id,
      updateData
    );
    if (!productUpdated) {
      return res
        .status(404)
        .json({ status: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ status: true, payload: productUpdated });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

export default apiProductsRouter;

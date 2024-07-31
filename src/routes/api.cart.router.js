import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const apiCartRouter = Router();
const apiCartManager = new CartManager();

apiCartRouter.post("/", async (req, res) => {
  try {
    const response = await apiCartManager.addCart();
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.get("/", async (req, res) => {
  try {
    const response = await apiCartManager.getCarts();

    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.get("/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    res.status(200).send(await apiCartManager.getCartById(ID));
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.delete("/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    res.status(200).send(await apiCartManager.deleteCartById(ID));
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.put("/:cid/addProduct/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await apiCartManager.addProductToCart(
      cid,
      pid,
      req.body.quantity
    );
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.put("/:cid/decreaseProduct/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await apiCartManager.decreaseProductFromCart(
      cid,
      pid,
      req.body.quantity
    );
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.put("/:cid/deleteProduct/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await apiCartManager.deleteProductFromCart(cid, pid);
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.put("/:cid/updateQuantity/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await apiCartManager.updateQuantity(
      cid,
      pid,
      req.body.quantity
    );
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

apiCartRouter.put("/clear/:cid", async (req, res) => {
  try {
    const response = await apiCartManager.clearCart(req.params.cid);
    res.status(200).json({ status: true, payload: response });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "Hubo un error en el servidor" });
  }
});

export default apiCartRouter;

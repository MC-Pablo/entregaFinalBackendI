import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const appCartRouter = Router();
const cartsManager = new CartManager();

appCartRouter.get("/", async (req, res) => {
    try {
        const allCarts = await cartsManager.getCarts();
        if (!allCarts) {
            return res.status(404).send("Carritos no encontrados");
        }
        res.status(200).render("carts", { title: "Carts", carts: allCarts });
    } catch (error) {
        res.status(500).send(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});


appCartRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cart = await cartsManager.getCartById(id);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.status(200).render("cartDetail", { title: "Cart Detail", cart: cart });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});

appCartRouter.post("/:id/clear", async (req, res) => {
    try {
        const ID = req.params.id;
        const result = await cartsManager.clearCart(id); // 
        if (result === false) {
            return res.status(404).send("<h1>Carrito no encontrado</h1>");
        } else if (result === "Error al eliminar los productos del carrito") {
            return res.status(500).send("<h1>Error al eliminar los productos del carrito</h1>");
        }
        res.status(200).redirect(`/carts/${id}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1>Hubo un error en el servidor</h1>");
    }
});



export default appCartRouter;
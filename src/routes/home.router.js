import { Router } from "express";

const homeRouter = Router();


homeRouter.get("/realtimeproducts", async (req, res) => {
    try {
        return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

homeRouter.get("/", async (req, res) => {
    try {
        return res.status(200).render("home", { title: "Home" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

export default homeRouter;
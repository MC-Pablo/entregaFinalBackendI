import { Router } from "express";
import UsersManager from "../managers/UsersManager.js";
import { ERROR_SERVER } from "../constants/messages.constant.js";

const appUsersRouter = Router();
const userManager = new UsersManager();

appUsersRouter.get("/", async (req, res) => {
    try {
        const user = await userManager.getAll();
        res.status(200).render("users", { title: "Usuarios", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default appUsersRouter;
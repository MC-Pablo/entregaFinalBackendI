import { Router } from "express";
import UsersManager from "../managers/UsersManager.js";

const apiUsersRouter = Router();
const usersManager = new UsersManager();

apiUsersRouter.get("/", async (req, res) => {
    try {
        const usersFound = await usersManager.getAll();
        res.status(200).json({ status: true, payload: usersFound });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

apiUsersRouter.get("/:id", async (req, res) => {
    try {
        const userFound = await usersManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: userFound });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


apiUsersRouter.delete("/:id", async (req, res) => {
    try {
        const userDeleted = await usersManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: userDeleted });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default apiUsersRouter;
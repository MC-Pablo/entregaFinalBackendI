import { Router } from "express";
import UsersManager from "../managers/UsersManager.js";
import uploader from "../utils/uploader.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

const apiUsersRouter = Router();
const usersManager = new UsersManager();

apiUsersRouter.get("/", async (req, res) => {
    try {
        const usersFound = await usersManager.getAll();
        res.status(200).json({ status: true, payload: usersFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiUsersRouter.get("/:id", async (req, res) => {
    try {
        const userFound = await usersManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: userFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiUsersRouter.post("/", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const userCreated = await usersManager.insertOne(req.body, file);
        res.status(201).json({ status: true, payload: userCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiUsersRouter.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const userUpdated = await usersManager.updateOneById(req.params.id, req.body, file);
        res.status(200).json({ status: true, payload: userUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

apiUsersRouter.delete("/:id", async (req, res) => {
    try {
        const userDeleted = await usersManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: userDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

export default apiUsersRouter;
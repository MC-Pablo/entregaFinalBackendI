import { Router } from "express";
import StudentsManager from "../managers/StudentsManager.js";
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

const router = Router();
const studentsManager = new StudentsManager();

router.get("/", async (req, res) => {
    try {
        const studentsFound = await studentsManager.getAll();
        res.status(200).json({ status: true, payload: studentsFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const studentFound = await studentsManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: studentFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const studentCreated = await studentsManager.insertOne(req.body, file);
        res.status(201).json({ status: true, payload: studentCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const studentUpdated = await studentsManager.updateOneById(req.params.id, req.body, file);
        res.status(200).json({ status: true, payload: studentUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const studentDeleted = await studentsManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: studentDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

export default router;
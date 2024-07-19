
import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import FileSystem from "../utils/fileSystem.js"
import paths from "../utils/paths.js";
import { convertToBoolean } from "../utils/converter.js";
import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class IngredientManager {
    #productModel;
    #fileSystem;

    constructor () {
        this.#productModel = ProductModel;
        this.#fileSystem = new FileSystem();
    }

    getAll = async (paramFilters) => {
        try {
            const $and = [];

            if (paramFilters?.name) $and.push({ name: { $regex: paramFilters.name, $options: "i" } });
            if (paramFilters?.category) $and.push({ category: paramFilters.category });
            if (paramFilters?.stock) $and.push({ stock: convertToBoolean(paramFilters.stock) });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters?.limit ?? 5,
                page: paramFilters?.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                lean: true,
            };

            const productsFound = await this.#productModel.paginate(filters, paginationOptions);
            return productsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id).lean();

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async (data, filename) => {
        try {
            const productCreated = new ProductModel(data);
            productCreated.stock = convertToBoolean(data.stock);
            productCreated.thumbnail = filename ?? null;
            await productCreated.save();

            return productCreated;
        } catch (error) {
            if (filename) await this.#fileSystem.delete(paths.images, filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    updateOneById = async (id, data, filename) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id);
            const currentThumbnail = productFound.thumbnail;
            const newThumbnail = filename;

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            productFound.name = data.name;
            productFound.description = data.description;
            productFound.category = data.category;
            productFound.stock = convertToBoolean(data.stock);
            productFound.thumbnail = newThumbnail ?? currentThumbnail;
            await productFound.save();

            if (filename && newThumbnail != currentThumbnail) {
                await this.#fileSystem.delete(paths.images, currentThumbnail);
            }

            return productFound;
        } catch (error) {
            if (filename) await this.#fileSystem.delete(paths.images, filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    deleteOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(id);

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#productModel.findByIdAndDelete(id);
            await this.#fileSystem.delete(paths.images, productFound.thumbnail);

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
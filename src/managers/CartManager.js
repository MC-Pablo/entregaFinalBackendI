import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class CategoryManager {
    #cartModel; }

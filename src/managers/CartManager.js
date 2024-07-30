import mongoose from "mongoose";
import ProductManager from "./ProductsManagers.js"
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";



const PRODUCT = new ProductManager();

export default class CartManager {
    #itemModel;

    constructor() {
        this.#itemModel = CartModel;
    }

    addCart = async () => {
        try {
            const cart = new this.#itemModel({ products: [] });
            await cart.save();
            return "Carrito Agregado";
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al agregar el carrito";
        }
    };

    getCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            const respuesta = await this.#itemModel.findById(id);
            if(!respuesta){
                return "Carrito no encontrado";
            } else {
                return respuesta;
            }
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener el carrito";
        }
    };

    addProductToCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }
        try {
            const cart = await this.#itemModel.findById(cartId);
            const product = await PRODUCT.getProductById(productId);

            if (!cart) {
                return "Carrito no encontrado";
            }
            if (!product) {
                return "Producto no encontrado";
            }

            const productInCart = cart.products.find((p) => p.id._id.toString() === productId.toString());

            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            await cart.save();
            return productInCart ? "Cantidad Incrementada" : "Producto Agregado";

        } catch (error) {
            console.log(error.message);
            return "Error al agregar el producto al carrito";
        }
    };

    deleteProductFromCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }

        try {
            const cart = await this.#itemModel.findById(cartId);

            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
                return "Producto Eliminado";
            } else {
                return "Producto no encontrado en el carrito";
            }

        } catch (error) {
            console.log(error.message);
            return "Error al eliminar el producto del carrito";
        }
    };

    updateCartQuantity = async (cartId, productId, quantity) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }

        try {
            const cart = await this.#itemModel.findById(cartId);

            if (!cart) {
                return "Carrito no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.id._id.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return "Cantidad de producto modificada";
            } else {
                return "Producto no encontrado en el carrito";
            }

        } catch (error) {
            console.log(error.message);
            return "Error al modificar la cantidad del producto en el carrito";
        }
    };

    deleteCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            const cart = await this.#itemModel.findById(id);

            if (!cart) {
                return "Carrito no encontrado";
            }

            await this.#itemModel.findByIdAndDelete(id);
            return "Carrito Eliminado";
        } catch (error) {
            console.log(error.message);
            return "Error al eliminar los productos del carrito";
        }
    };

    updateCart = async (id, updateData) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }

        const productId = await this.#itemModel.findById(id);

        if(productId !== id) {
            return "Ese Id no existe";
        }

        try {
            const updatedCart = await this.#itemModel.findByIdAndUpdate(id, updateData, { new: true });
            if (updatedCart) {
                return updatedCart; // Devuelve el carrito actualizado en lugar de un mensaje de texto
            } else {
                return null; // Devuelve null si no se encontró el carrito
            }
        } catch (error) {
            console.log(error.message);
            return "Error al actualizar el carrito"; // Lanza un error si algo sale mal
        }
    };

    clearCart = async (cartId) => {
        if (!mongoDB.isValidId(cartId)) {
            return false;
        }
        try {
            const cart = await this.#itemModel.findById(cartId);
            if (!cart) {
                return false;
            }
            cart.products = [];
            return await cart.save();
        } catch (error) {
            console.log(error.message);
            return "Error al eliminar los productos del carrito";
        }
    };

    getCarts = async () => {
        try {
            return await this.#itemModel.find().populate("products").lean();
        } catch (error) {
            console.log(error.message);
            return "Hubo un error al obtener los carritos";
        }
    };
}
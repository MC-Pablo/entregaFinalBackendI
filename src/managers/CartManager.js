import mongoose from "mongoose";
import ProductManager from "./ProductsManagers.js";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

const PRODUCT = new ProductManager();

export default class CartManager {
  #cartModel;

  constructor() {
    this.#cartModel = CartModel;
  }

  addCart = async () => {
    try {
      const cart = new CartModel();
      cart.save();
      return cart;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(error.errors)[0];
      }
      throw new Error(error.message);
    }
  };
  getCarts = async () => {
    try {
      const carts = await this.#cartModel.find().lean();
      return carts;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  getCartById = async (id) => {
    if (!mongoDB.isValidID(id)) {
      return "ID no válido";
    }
    try {
      const respuesta = await this.#cartModel.findById(id);
      if (!respuesta) {
        return "Carrito no encontrado";
      } else {
        return respuesta;
      }
    } catch (error) {
      console.log(error.message);
      return "Hubo un error al obtener el carrito";
    }
  };

  addProductToCart = async (cid, pid, quantity) => {
    try {
      quantity = Number(quantity);
      if (!mongoDB.isValidID(cid)) {
        throw new Error("error");
      }

      if (!mongoDB.isValidID(pid)) {
        throw new Error("error");
      }

      const cart = await this.#cartModel.findById(cid);

      if (!cart) {
        throw new Error("error");
      }

      const obj_pid = new mongoose.Types.ObjectId(pid);

      if (cart.products) {
        const productIndex = cart.products.findIndex((p) =>
          p.product.equals(pid)
        );
        if (productIndex !== -1) {
          const fullCart = await this.#cartModel
            .findById(cid)
            .populate("products.product")
            .lean();
          const productStock = fullCart.products[productIndex].product.stock;
          if (cart.products[productIndex].quantity + quantity > productStock) {
            cart.products[productIndex].quantity = productStock;
          } else {
            cart.products[productIndex].quantity += quantity;
          }
        } else {
          cart.products.push({ product: obj_pid, quantity });
        }
      } else {
        const fullCart = await this.#cartModel
          .findById(cid)
          .populate("products.product")
          .lean();
        const productStock = fullCart.products[productIndex].product.stock;
        if (quantity > productStock) {
          cart.products.push({ product: pid, quantity: productStock });
        } else {
          cart.products.push({ product: pid, quantity });
        }
      }

      await cart.save();
      const updatedCart = await this.#cartModel
        .findById(cid)
        .populate("products.product")
        .lean();
      return updatedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteProductFromCart = async (cid,pid) => {
    try {
        cid = new mongoose.Types.ObjectId(cid.trim())
        pid = new mongoose.Types.ObjectId(pid.trim())

        if(!mongoDB.isValidID(cid)){
            throw new Error("error en el id del carrito")
        }

        if(!mongoDB.isValidID(pid)){
            throw new Error("error en el id del producto")
        }
        const cart = await this.#cartModel.findByIdAndUpdate(
            cid,
            {$pull: {products: {product: pid}}},
            {new: true}
        ).populate('products.product').lean();
        if(!cart){
            throw new Error("error en el id del carrito")
        }
        return cart
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            error.message = Object.values(error.errors)[0];
        }

        throw new Error(error.message);
    }
}

decreaseProductFromCart = async (cid,pid, quantity) => {
    try {
        cid = new mongoose.Types.ObjectId(cid.trim())
        pid = new mongoose.Types.ObjectId(pid.trim())

        if(!mongoDB.isValidID(cid)){
            throw new Error("error en el id del carrito")
        }

        if(!mongoDB.isValidID(pid)){
            throw new Error("error en el id del producto")
        }

        const cart = await this.#cartModel.findById(cid);

        if(!cart){
            throw new Error("id no encontrado")
        }

        const productIndex = cart.products.findIndex(p => p.product.equals(pid));
        if(productIndex !== -1){
            if(cart.products[productIndex].quantity - quantity >= 1){
                cart.products[productIndex].quantity -= quantity
            } else {cart.products[productIndex].quantity = 1};
        } else {
            throw new Error('Producto inexistente en el carrito')
        }

        await cart.save();

        const updatedCart = await this.#cartModel.findById(cid).populate('products.product').lean()

        return updatedCart;
    } catch (error) {

        if (error instanceof mongoose.Error.ValidationError) {
            error.message = Object.values(error.errors)[0];
        }

        throw new Error(error.message);
    }
}


  updateCartQuantity = async (cartId, productId, quantity) => {
    if (!mongoDB.isValidID(cartId) || !mongoDB.isValidID(productId)) {
      return "ID no válido";
    }

    try {
      const cart = await this.#cartModel.findById(cartId);

      if (!cart) {
        return "Carrito no encontrado";
      }

      const productIndex = cart.products.findIndex(
        (p) => p.id._id.toString() === productId.toString()
      );

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
    if (!mongoDB.isValidID(id)) {
      return "ID no válido";
    }
    try {
      const cart = await this.#cartModel.findById(id);

      if (!cart) {
        return "Carrito no encontrado";
      }

      await this.#cartModel.findByIdAndDelete(id);
      return "Carrito Eliminado";
    } catch (error) {
      console.log(error.message);
      return "Error al eliminar los productos del carrito";
    }
  };

  updateCart = async (id, updateData) => {
    if (!mongoDB.isValidID(id)) {
      return null;
    }

    const productId = await this.#cartModel.findById(id);

    if (productId !== id) {
      return "Ese Id no existe";
    }

    try {
      const updatedCart = await this.#cartModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
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
    if (!mongoDB.isValidID(cartId)) {
      return false;
    }
    try {
      const cart = await this.#cartModel.findById(cartId);
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
}

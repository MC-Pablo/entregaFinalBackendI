import { Schema, model } from "mongoose";

const cartsDB = "carts";

const cartItemSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    _id: false, // esto para que no aparezca el _id.
});

const CART_SCHEMA = new Schema({
    products: [cartItemSchema],
});

CART_SCHEMA.pre(/^find/, function(next) {
    this.populate({
        path: "products.id",
        model: "products", // Debe coincidir con el nombre de tu modelo de productos en mongoose
    });
    next();
});

const CartModel = model(cartsDB, CART_SCHEMA);
export default CartModel;
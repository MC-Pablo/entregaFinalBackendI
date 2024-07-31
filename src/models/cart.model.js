import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'products'
          },
          quantity: {
            type: Number,
          }
        }
      ]
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
});



const CartModel = model('carts', cartSchema);

export default CartModel;
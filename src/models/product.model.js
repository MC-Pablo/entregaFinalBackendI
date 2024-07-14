import { Schema, model } from "mongoose";

const productSchema = new Schema({
 
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
    maxLength: 255,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    format: "uri",
  },
  stock: {
    type: Number,
    required: true,
  },

  category: [{
    type: Schema.Types.ObjectId,
    ref: "categories",
}],


}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
});


const ProductModel = model("products", productSchema);

export default ProductModel;


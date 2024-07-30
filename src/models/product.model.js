import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: { name: "idx_category" },
    },
    name: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: { name: "idx_title" },
    },
    description: { type: String, lowercase: true, required: true, trim: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array, required: true },
    stock: { type: Number, required: true },
    brand: {type: String, require:true}
  },
  {
    versionKey: false,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

productSchema.index({ category: 1, title: 1 }, { name: "idx_category_title" });
productSchema.plugin(paginate);
const ProductModel = model(productCollection, productSchema);
export default ProductModel;

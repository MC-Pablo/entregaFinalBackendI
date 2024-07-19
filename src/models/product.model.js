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
    enum: [
      "cremas hidratantes",
      "jabones",
      "protectores solares",
    ],
  },
  thumbnail: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Boolean,
    required: true,
  },

}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
},
{toJSON: { virtuals: true }});


productSchema.virtual("carts", {
  ref: "carts", // Nombre de la collection externa
  localField: "_id", // Nombre del campo de referencia que esta en esta collection
  foreignField: "products", // Nombre del campo de referencia que está en la collection externa
  justOne: false,
});

productSchema.pre("findByIdAndDelete", async function(next) {
  const cartModel = this.model("cart");

  await cartModel.updateMany(
      { carts: this._id },
      { $pull: { carts: this._id } },
  );

  next();
});

productSchema.plugin(paginate);


const ProductModel = model("products", productSchema);
export default ProductModel;

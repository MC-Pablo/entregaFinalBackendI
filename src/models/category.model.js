import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type: String,
        require:true,
        unique: true
    }
},{toJSON: { virtuals: true }})

categorySchema.virtual("products", {
    ref: "products", // Nombre de la collection externa
    localField: "_id", // Nombre del campo de referencia que esta en esta collection
    foreignField: "category", // Nombre del campo de referencia que está en la collection externa
    justOne: false,
});

const CategoryModel = model("categories", categorySchema); 
export default CategoryModel; 
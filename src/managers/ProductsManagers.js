import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

export default class ProductManager {
  #productModel;

  constructor() {
    this.#productModel = ProductModel;
  }

  getAll = async (paramFilters) => {
    try {
      const categoryFilter = () => {
        if (paramFilters.categories) {
          const categoryIds = paramFilters.categories
            .split(",")
            .map((id) => new mongoose.Types.ObjectId(id.trim()));
          return { categories: { $in: categoryIds } };
        } else {
          return {};
        }
      };

      const filter = categoryFilter();

      const sort = {
        asc: { name: 1 },
        desc: { name: -1 },
      };

      const paginationOptions = {
        limit: paramFilters.limit ?? 10,
        page: paramFilters.page ?? 1,
        sort: sort[paramFilters?.sort] ?? {},
        lean: true,
      };
      const productsFound = await this.#productModel.paginate(
        filter,
        paginationOptions
      );
      return productsFound;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getOneById = async (id) => {
    if (!mongoDB.isValidID(id)) {
      return null;
    }
    try {
      const product = await this.#productModel.findById(id).lean();
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      console.log(error.message);
      return "Hubo un error al obtener el producto";
    }
  };

  deleteOneById = async (id) => {
    if (!mongoDB.isValidID(id)) {
      return null;
    }
    try {
      await this.#productModel.findByIdAndDelete(id);
      return "Producto Eliminado";
    } catch (error) {
      console.log(error.message);
      return "Hubo un error al eliminar el producto";
    }
  };

  addProduct = async ({
    category,
    name,
    description,
    price,
    thumbnail = [],
    stock,
    brand,
  }) => {
    if (!category || !name || !description || !price || !stock) {
      console.log("Todos los campos son obligatorios");
    }
    const products = await this.#productModel.find().lean();
    try {
      const product = new this.#productModel({
        category,
        name,
        description,
        price,
        thumbnail,
        stock,
        brand,
      });
      await product.save();
      return "Producto agregado correctamente";
    } catch (error) {
      console.log(error.message);
      return "Hubo un error al agregar el producto";
    }
  };
  updateProduct = async ( id, updateData ) => {
    if (!mongoDB.isValidID(id)) {
        return null;
    }
    try {
        const updatedProduct = await this.#productModel.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedProduct) {
            return "Producto Modificado";
        } else {
            return "Producto no encontrado";
        }
    } catch (error) {
        console.log(error.message);
        return "Hubo un error al actualizar el producto";
    }
};
 
}

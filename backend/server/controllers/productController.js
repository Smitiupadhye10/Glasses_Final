import Product from "../models/Product.js";

const HIERARCHICAL_KEYS = new Set([
  "Gender",
  "Collection",
  "Shape",
  "Style",
  "Brands",
  "Usage",
  "Explore by Disposability",
  "Explore by Power",
  "Explore by Color",
  "Solution",
]);

function mapKeyToProductInfoPath(key) {
  const lowerKey = key.toLowerCase();
  if (lowerKey === "brands" || lowerKey === "brand") return "product_info.brand";
  if (lowerKey === "gender") return "product_info.gender";
  if (lowerKey === "shape") return "product_info.frameShape";
  if (lowerKey === "style") return "product_info.rimDetails";
  if (lowerKey === "usage") return "product_info.usage";
  if (lowerKey === "explore by disposability") return "product_info.disposability";
  if (lowerKey === "explore by power") return "product_info.power";
  if (lowerKey === "explore by color") return "product_info.color";
  if (lowerKey === "solution") return "product_info.solution";
  return `product_info.${lowerKey}`;
}

export const listProducts = async (req, res) => {
  try {
    const query = req.query || {};
    const andConditions = [];

    if (query.category) andConditions.push({ category: query.category });
    if (query.subCategory) andConditions.push({ subCategory: query.subCategory });
    if (query.subSubCategory) andConditions.push({ subSubCategory: query.subSubCategory });

    for (const [key, rawVal] of Object.entries(query)) {
      if (!HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({
        $or: [
          { subCategory: key, subSubCategory: rawVal },
          { [infoPath]: { $regex: `^${val}$`, $options: "i" } },
        ],
      });
    }

    for (const [key, rawVal] of Object.entries(query)) {
      if (key === "category" || key === "subCategory" || key === "subSubCategory") continue;
      if (HIERARCHICAL_KEYS.has(key)) continue;
      const infoPath = mapKeyToProductInfoPath(key);
      const val = String(rawVal);
      andConditions.push({ [infoPath]: { $regex: `^${val}$`, $options: "i" } });
    }

    if (query.search) {
      andConditions.push({ title: { $regex: query.search, $options: "i" } });
    }

    const mongoFilter = andConditions.length > 0 ? { $and: andConditions } : {};

    const products = await Product.find(mongoFilter);
    res.json(products);
  } catch (error) {
    res.json([]);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };

    // Case-insensitive existence check to prevent duplicates by title
    const existing = await Product.findOne({ title: body.title }).collation({ locale: "en", strength: 2 });
    if (existing) {
      return res.status(409).json({ message: "Product title must be unique" });
    }

    // Normalize images
    let imagesArray = [];
    if (Array.isArray(body.images)) imagesArray = body.images.filter(Boolean);
    if (!imagesArray.length && body.Images) {
      const { image1, image2 } = body.Images || {};
      imagesArray = [image1, image2].filter(Boolean);
    }
    if (!imagesArray.length && body.image1) {
      imagesArray = [body.image1, body.image2].filter(Boolean);
    }

    const payload = {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      subCategory: body.subCategory,
      subSubCategory: body.subSubCategory,
      product_info: body.product_info || {},
      images: imagesArray,
      ratings: body.ratings,
      discount: body.discount,
    };

    const created = await Product.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Product title must be unique" });
    }
    return res.status(400).json({ message: "Error creating product", error });
  }
};

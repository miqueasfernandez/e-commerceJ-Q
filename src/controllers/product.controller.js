import productModel from "../dao/models/product.model.js";
import userDao from "../dao/user.dao.js";
import { fastResponse } from "../utils/reusables.js";
import { extractUserFromToken } from "../middlewares/auth.js";

class ProductController {
    static ultId = 0
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    //create product by body, if product already exist return 400
    async createProduct(req, res) {
        try {
            console.log("Headers:", req.headers);
            console.log("Request body:", req.body); // recibed DATA depuration 

        if (!req.body || Object.keys(req.body).length === 0) {
            return fastResponse(res, 400, "No data received in request body");
        }

            const { title, description, code, price, stock, category, status, img } = req.body;
    
            // Verified that all fields are required
            if (!title || !description || !code || !price || !stock || !category || !status || !img) {
                console.log("All fields are required");
                return fastResponse(res, 400, "All fields are required");
            }
    
            // Verified that 'code' is unique
            const existingProduct = await productModel.findOne({ code });
            if (existingProduct) {
                console.log("Code must be unique");
                return fastResponse(res, 400, "Code must be unique");
            }
    
            // Verified that 'category' is a string
            const formattedCategory = typeof category === "string" ? category : "Uncategorized";
    
            // get last id
            const productArray = await productModel.find();
            const lastId = productArray.length > 0 
                ? productArray.reduce((maxId, product) => Math.max(maxId, product.id), 0) 
                : 0;
    
            // Create the new product
            const newProduct = new productModel({
                id: lastId + 1,
                title,
                description,
                code,
                price,
                stock,
                category: formattedCategory, // make sure it's a string
                status,
                img
            });
    
            // save the new product
            await newProduct.save();
    
            //  Return response
            fastResponse(res, 200, "Product created successfully");
        } catch (error) {
            console.error("Error creating product:", error);
            fastResponse(res, 400, error.message);
        }
    }

    //getting limited products each page, 10 product in this case 
    async getProducts(req, res) {
        
            const limit = parseInt(req.query.limit) || 10; // use 10 as default limit
            const page = parseInt(req.query.page) || 1;    // use 1 as default page 
            const sort = req.query.sort || '';             // use an empty string as default
            const query = req.query.query || '';           // use an empty string as default

            const skip = (page - 1) * limit;
            let queryOptions = {};

            const fixedQuery = typeof query === "string" ? query : null;
            if (fixedQuery) {
                queryOptions = { category: fixedQuery };
            }
    
            /*
            DEPURATION

            console.log("Query Options (fixed):", queryOptions);
            console.log("Raw query value:", query);
            */
            try {
            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                } else {
                    queryOptions = {}; // No sort applied 
                }
            }   

            
            /*
            DEPURATION

            console.log('Sort Options:', sortOptions);
            console.log('Skip:', skip);
            console.log('Limit:', limit);
            */

            console.log("Fetching products...");
            const products = await productModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean();
                

            const totalProducts = await productModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;
            
            // this function extract the user from the token to be usued in the view, because de view need the user info to be displayed, extractuserfromtoken is in auth.js
            const userData = extractUserFromToken(req);
                 if (!userData) {
                return res.status(401).render('error', { message: 'User not authenticated' });
            }
            const user = await userDao.findById(userData.id); 
                 if (!user) {
                return res.status(404).render('error', { message: 'User not found' });
                
            }

            console.log("Returning response...");
            return res.render('products', {
            css: ['shared', 'product'],
            user: {
                username: user.username,
                cartId: user.cartId.toString()
            },
            products,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
            hasPrevPage,
            hasNextPage,
            limit,
            sort,
            query
            });

            

        } catch (error) {
            console.log("error to get products from db", error.message);
            res.status(500).render("error", { message: "Error fetching products" });
        }
    };

    //getting product by id, if product not found return 404
    async getProductById (req, res) {
        try {
            const id = req.params.id;
            const product = await productModel.findById(id);

            if (!product || product.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            return res.json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            fastResponse(res, 400, error.message);
        }
    }
    
  


    async updateProduct(req, res) {
        const id = req.params.id;
        const updatedProduct = req.body;
        try {
            await productModel.findByIdAndUpdate(id, updatedProduct);
            fastResponse(res, 200, "Product updated successfully");
            await updatedProduct.save();
        } catch (error) {
            fastResponse(res, 400, error.message);
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.id;
        try {
            const deleteProduct = await productModel.findByIdAndDelete(id);
            if (!deleteProduct) {
            fastResponse(res, 404, "Product not found");
            }
            return res.json({ message: "Product deleted successfully" });
        } catch (error) {
            fastResponse(res, 400, error.message);
        }
    }
}

export default new ProductController()
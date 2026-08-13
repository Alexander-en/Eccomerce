import connectToDB from "@/database"
import Product from "@/models/product"
import Joi from "joi"
import { NextResponse } from "next/server"
import AuthUser from "@/middleware/AuthUser"

const AddNewProductSchema = Joi.object({
    // name: Joi.string().required(),
    // description: Joi.string().required(),
    // price: Joi.number().required(),
    // category: Joi.string().required(),
    // sizes: Joi.array().required(),
    // deliveryInfo: Joi.string().required(),
    // onSale: Joi.string().required(),
    // priceDrop: Joi.number().required(),
    // imageUrl: Joi.string().required(),

     name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().trim().min(1).required(),
  sizes: Joi.array().min(1).required(),
  deliveryInfo: Joi.string().trim().min(1).required(),
  onSale: Joi.string().valid("yes", "no").required(),
  priceDrop: Joi.number().min(0).required(),
  imageUrl: Joi.string().uri().required(),
})

export const dynamic = 'force-dynamic'


export async function POST(req) {
    try {
        await connectToDB();
        // const user = "admin";
        const isAuthUser= await AuthUser(req)
        if (isAuthUser?.user === "admin") {
            const extractData = await req.json()
            const { name, description, price, category, sizes, deliveryInfo, onSale, priceDrop, imageUrl } = extractData || {}
            const {error} = AddNewProductSchema.validate({
                name, description, price, category, sizes, deliveryInfo, onSale, priceDrop, imageUrl
            })

            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                })
            }

            const newlyCreatedProduct = await Product.create({
                name,
                description,
                price: Number(price),
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop: Number(priceDrop),
                imageUrl,
            })
            if (newlyCreatedProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Product added successfully !"
                })
            }
            else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to add the product! Please try again later"
                })
            }
        }
        else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized !!"
            })
        }
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong, please try again later"
        })
    }
}
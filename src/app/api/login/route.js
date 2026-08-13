import connectToDB from "@/database"
import Joi from "joi"
import User from "@/models/user"
import { compare } from "bcryptjs"
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server"

export const dynamic='force-dynamic'



const schema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})
export async function POST(req){

    await connectToDB()
    const{email,password}= await req.json()

    const {error} = schema.validate({email,password})

        if (error) {
            return NextResponse.json({
                success: false,
                message: error.details[0].message
            })
        }

        try{
            const checkUser = await User.findOne({email});
            if(!checkUser){
                return NextResponse.json({
                success: false,
                message: "Account does not exist with this email"
            })
            }

            const checkPassword = await compare(password,checkUser.password);
            if(!checkPassword){
                return NextResponse.json({
                success: false,
                message: "Incorrect Password.Please try again"
            })
            }

            const token = jwt.sign({
                id : checkUser._id , email : checkUser?.email , role : checkUser?.role

            }, process.env.JWT_SECRET || 'default_secret_key', {expiresIn : '1d'})
            
            const finalResult = {
                token,
                user : {
                    email : checkUser.email,
                    name : checkUser.name,
                    _id : checkUser._id,
                    role : checkUser.role
                }
            }

      
            return NextResponse.json({
                success: true,
                message: 'Login Successful',
                finalResult

            })
        

        }
        catch(error){
            console.log(`Error in login route ${error}`);
                    return NextResponse.json({
                        success: false,
                        message: "Something went wrong while logging the user, please try again later"
                    })
        }
}

/*
Why finalResult was created
finalResult is just a simple object that groups the important data into one response payload.
It is created like this because the frontend likely needs both:
a login token
the user’s basic profile information

That is helpful because the frontend can do something like:
res.finalResult.token
res.finalResult.user.name

instead of reading many separate top-level fields.

In simple words
This route does this:

receives login info
validates it
checks the user
checks the password
creates a token
sends back the token and user info
*/
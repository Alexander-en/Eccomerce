import connectToDB from '@/database';
import Joi from 'joi';
import { hash } from 'bcryptjs';
import User from '@/models/user';
import { NextResponse } from 'next/server';


//Joi is used for data validation that is used to validate the data that is coming from the frontend to the backend.

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required()
})

//This line is used to force the dynamic rendering of the page. It is used to force the page to be rendered on the server side. 
export const dynamic = 'force-dynamic';

export async function POST(req) {
    await connectToDB();
    const { name, email, password, role } = await req.json();

    //validate the Schema
    const { error } = schema.validate({ name, email, password, role });

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message
        })
    }
    try {
        //check if user already exists or not
        const isUserAlreadyExists = await User.findOne({ email });
        if (isUserAlreadyExists) {
            return NextResponse.json({
                success: false,
                message: "User already exists with this email. Please try again with different email or login with this email"
            })
        }
        //for New User Registration we will hash the password and then save the user in the database
        const hashPassword = await hash(password, 12);
        const newUser = await User.create({ name, email, password: hashPassword, role });
        if (newUser) {
            return NextResponse.json({
                success: true,
                message: "User registered successfully"
            })
        }
        return NextResponse.json({
            success: false,
            message: "Unable to register user."
        })
    }
    catch (error) {
        console.log(`Error in register route ${error}`);
        return NextResponse.json({
            success: false,
            message: "Something went wrong while registering the user, please try again later"
        })
    }
}
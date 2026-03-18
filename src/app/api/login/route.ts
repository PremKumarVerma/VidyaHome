import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

connect()

export async function POST(req: NextRequest){
    try {
        const data = await req.json()
        const {email} = data;

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({message: "User not found"}, {status: 404})
        }
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error: any) {
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest){
    try {
        const data = await req.json()
        const {email} = data;
    
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({message: "User already exists"}, {status: 400})
        }
    
        const newUser = new User({
            email,
            username: email.split("@")[0],
            role: "freeUser"
        });
    
        const savedUser = await newUser.save();
    
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
    } catch (error) {
        return NextResponse.json({message: "Error creating user"}, {status: 500})
    }

}
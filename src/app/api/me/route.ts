import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

// Helps To Find all the User info
export async function GET(req: NextRequest) {
    try {
        const userId = await getDataFromToken(req)
        const user = await User.findOne({ _id: userId }).select("-password")  
        return NextResponse.json({
            message: "User data retrieved successfully",
            data: user
        })   
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}
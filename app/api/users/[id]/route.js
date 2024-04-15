import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    console.log("getById...", params);
    await connectMongoDB();
    const users = await User.find({ _id: params.id }, { password: 0, __v: 0 });
    return NextResponse.json(users.length ? { user: users[0] } : ("User " + params + " not found", {
        status: 400,
    }));
}

export async function POST(req, { params }) {
    const body = await req.json();
    console.log("Update...", body, params);
    const userUpdated = await User.findByIdAndUpdate(params.id, {
        name: body.name,
        email: body.email,
        role: body.role,
        rut: body.rut,
        gender: body.gender,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        avatarImg: body.avatarImg
    }, {
        new: true
    });
    return userUpdated ? NextResponse.json(userUpdated) : NextResponse.json(error.message, {
        status: 404,
    })
}



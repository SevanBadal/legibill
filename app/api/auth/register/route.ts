import {hash} from "bcrypt";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Check if the email already exists in the database
        const userExists = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (userExists) {
            return NextResponse.json(
                { error: "An error occurred. Please try again later." },
                { status: 500 }
            );
        }

        const hashedPassword = await hash(password, 10);

        // Insert the new user into the database
        await prisma.users.create({
            data: {
                email: email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: 'User created successfully.' },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: 'An error occurred while processing your request.' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

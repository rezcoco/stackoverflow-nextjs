import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { question } = await request.json()
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a great assistant with huge knowledge" },
                { role: "user", content: `Tell me ${question}` }
            ],
            model: "gpt-3.5-turbo",
        });


        return NextResponse.json({
            data: chatCompletion.choices[0].message.content
        })
    } catch (error: any) {
        console.log(error.message)
        throw error.message
    }
}
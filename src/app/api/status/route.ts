import { NextRequest, NextResponse } from "next/server"

export function GET() {
    return NextResponse.json({
        status : "Good"
    })
}

export const baseUrl = `http://13.233.192.195:3000/api/v1/`
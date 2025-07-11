import { LoginSchemaType } from "@repo/shared-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginSchemaType;
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.type === "phone" ? body.phone : body.email,
        password: body.password,
      }),
    });
    if (!response.ok) {
      return NextResponse.json(
        {
          message: response.statusText,
        },
        { status: response.status }
      );
    }
    const setCookiesHeader = response.headers.getSetCookie();
    if (setCookiesHeader) {
      const response = NextResponse.json(
        { message: "Başarıyla giriş yaptınız" },
        { status: 200 }
      );
      setCookiesHeader.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
      return response;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

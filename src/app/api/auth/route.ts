import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV === "development") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const body = await req.json(); // { email, password }

    const apiRes = await fetch("https://localhost:6001/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Auth failed" },
        { status: apiRes.status }
      );
    }

    // create response and set httpOnly cookies
    const res = NextResponse.json({ ok: true });

    // accessToken expiry: set maxAge according to token's exp (here example 1 hour)
    res.cookies.set({
      name: "accessToken",
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour (adjust to your token)
    });

    // refresh token (longer expiry)
    res.cookies.set({
      name: "refreshToken",
      value: data.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth", // restrict where refresh is sent, optional
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

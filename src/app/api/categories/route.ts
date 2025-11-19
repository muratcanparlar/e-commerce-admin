import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper to get access token from httpOnly cookie
async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

// BASE URL of your ProductService
const BASE_URL = "https://localhost:5001/Categories";

//
// ⭐ GET — Fetch all products
//
export async function GET() {
  try {
    const token = getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//
// ⭐ POST — Create new product
//
// Expected body:
//
// {
//   "name": "Product Name",
//   "price": 100,
//   "stock": 50
// }
//
export async function POST(req: Request) {
  try {
    const token = getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("Response Status:", res.status);
    // Handle success statuses
    if (res.status === 200 || res.status === 201) {
      return NextResponse.json(
        {
          success: true,
          message: "Created successfully",
        },
        { status: res.status }
      );
    }

    // Error handling
    return NextResponse.json(
      {
        success: false,
        error: data?.message ?? "Failed",
      },
      { status: res.status }
    );
  } catch (err) {
    console.log("API Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

//
// ⭐ DELETE — Delete a product by ID
//
// Example usage:
// fetch("/api/products?id=123", { method: "DELETE" })
//
export async function DELETE(req: Request) {
  try {
    const token = getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

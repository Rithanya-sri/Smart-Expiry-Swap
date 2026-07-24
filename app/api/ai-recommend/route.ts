import { NextResponse } from "next/server";
import { getProductRecommendation, ProductInput } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body: ProductInput = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.category ||
      body.stock === undefined ||
      body.price === undefined ||
      !body.expiryDate
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields." },
        { status: 400 }
      );
    }

    const recommendation = await getProductRecommendation(body);

    return NextResponse.json(
      { success: true, data: recommendation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);

    // Check for API key issues
    if (
      error.message?.includes("GEMINI_API_KEY") ||
      error.message?.includes("API_KEY_INVALID")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing Gemini API key. Check your .env.local file.",
        },
        { status: 500 }
      );
    }

    // JSON parsing error from Gemini response
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "AI returned an unexpected response format. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to get AI recommendation." },
      { status: 500 }
    );
  }
}

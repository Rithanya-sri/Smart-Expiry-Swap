import { NextResponse } from "next/server";
import { getProductRecommendation as getGeminiRecommendation, ProductInput } from "@/lib/gemini";
import { getProductRecommendation as getRuleRecommendation } from "@/lib/recovery-engine";

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

    let recommendation;

    if (process.env.GEMINI_API_KEY) {
      try {
        recommendation = await getGeminiRecommendation(body);
      } catch (geminiError: any) {
        console.warn("Gemini API failed or key invalid, falling back to rule engine:", geminiError.message);
        recommendation = getRuleRecommendation(body);
      }
    } else {
      recommendation = getRuleRecommendation(body);
    }

    return NextResponse.json(
      { success: true, data: recommendation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Failed to get AI recommendation." },
      { status: 500 }
    );
  }
}

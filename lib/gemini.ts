import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

export interface ProductInput {
  name: string;
  category: string;
  stock: number;
  price: number;
  manufactureDate: string;
  expiryDate: string;
  branch: string;
  status: string;
}

export interface AIRecommendation {
  recoveryScore: number;
  recommendedAction:
    | "Continue Normal Sale"
    | "Apply Discount"
    | "Bundle With Another Product"
    | "Transfer To Another Branch"
    | "Notify Nearby Customers"
    | "Donate To NGO"
    | "Recycle / Compost";
  reason: string;
  estimatedRevenueRecovered: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
}

/**
 * Sends a product to Gemini Flash and returns a structured AI recommendation.
 * This function is reusable across the Dashboard, Inventory, and any future pages.
 */
export async function getProductRecommendation(
  product: ProductInput
): Promise<AIRecommendation> {
  const today = new Date().toISOString().split("T")[0];
  const expiry = new Date(product.expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const prompt = `
You are an expert AI system for a supermarket expiry management platform called Smart Expiry Swap.
Your task is to analyze the following product data and provide a recovery recommendation.

Today's Date: ${today}

Product Details:
- Name: ${product.name}
- Category: ${product.category}
- Stock Quantity: ${product.stock} units
- Unit Price: ₹${product.price}
- Manufacture Date: ${product.manufactureDate}
- Expiry Date: ${product.expiryDate}
- Days Until Expiry: ${daysUntilExpiry} days
- Branch: ${product.branch}
- Current Inventory Status: ${product.status}

Based on the above, generate a product recovery recommendation.

You MUST respond ONLY with a valid JSON object. Do NOT include any explanation, markdown, or code blocks.
The JSON must follow this exact structure:

{
  "recoveryScore": <integer from 0 to 100, where 100 means full recovery is very likely>,
  "recommendedAction": "<one of: Continue Normal Sale | Apply Discount | Bundle With Another Product | Transfer To Another Branch | Notify Nearby Customers | Donate To NGO | Recycle / Compost>",
  "reason": "<a concise 1-2 sentence explanation for this recommendation>",
  "estimatedRevenueRecovered": "<e.g. ₹1,200 (60% of ₹2,000)>",
  "priority": "<one of: Low | Medium | High | Urgent>"
}

Rules:
- If days until expiry <= 1, priority must be "Urgent".
- If days until expiry <= 3, priority must be "High".
- If days until expiry <= 7, priority must be "Medium".
- If days until expiry > 7, priority must be "Low".
- recoveryScore should reflect how much revenue can realistically be recovered given the time left.
- estimatedRevenueRecovered should be calculated from stock × price × a realistic recovery factor.
`;

  if (!model) {
    throw new Error("Gemini model is not initialized (missing API key).");
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed: AIRecommendation = JSON.parse(cleaned);
  return parsed;
}

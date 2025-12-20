import OpenAI from "openai";
import {NextResponse} from "next/server";
import {buildPrompt, NameLength, NameStyle, TonePreset} from "@/lib/prompts";

export const runtime = "nodejs"; // keep server-side

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({error: "Missing OPENAI_API_KEY"}, {status: 500});
    }

    const body = await req.json();
    const keywords = String(body.keywords ?? "").trim();
    const style = (body.style ?? "brandable") as NameStyle;
    const length = (body.length ?? "short") as NameLength;
    const tone = (body.tone ?? "minimal") as TonePreset;

    if (!keywords) {
      return NextResponse.json({error: "Keywords are required."}, {status: 400});
    }

    const prompt = buildPrompt({keywords, style, length, tone});

    // Responses API (recommended for new projects) :contentReference[oaicite:2]{index=2}
    const resp = await client.responses.create({
      model: "gpt-5.2",
      input: prompt
    });

    // Extract text output safely
    const text =
      resp.output_text ??
      "";

    // Try parsing JSON
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {error: err?.message ?? "Unknown error"},
      {status: 500}
    );
  }
}

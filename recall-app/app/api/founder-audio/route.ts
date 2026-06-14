import { NextResponse } from "next/server";
import { transcribeFounderAudio } from "@/lib/anthropic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const transcript = await transcribeFounderAudio(file);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("[founder-audio]", error);
    return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 });
  }
}

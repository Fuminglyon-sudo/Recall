import { NextResponse } from "next/server";
import { transcribeFounderAudio } from "@/lib/anthropic";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("founder-audio", userId, 20)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "File must be an audio recording." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (10MB max)." }, { status: 413 });
    }

    const transcript = await transcribeFounderAudio(file);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("[founder-audio]", error);
    return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 });
  }
}

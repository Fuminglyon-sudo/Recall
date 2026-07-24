import { NextRequest, NextResponse } from "next/server";
import { transcribeAudioChunk } from "@/lib/groq";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

// Belt-and-suspenders on the kill switch: the client already checks this
// flag before ever recording, but honoring it here too means flipping
// NEXT_PUBLIC_DOC_LAB_GROQ_MIC to false actually turns the feature off,
// not just hides the button while the endpoint keeps working.
const GROQ_MIC_ENABLED = process.env.NEXT_PUBLIC_DOC_LAB_GROQ_MIC === "true";

// Segments are a few seconds of speech each — generous enough that a
// natural back-to-back run of short pauses doesn't get throttled, tight
// enough that abuse (someone scripting requests) can't run up cost for free.
const LIMIT_PER_MINUTE = 40;
const MAX_CHUNK_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (!GROQ_MIC_ENABLED) {
    return NextResponse.json({ error: "Live transcription is disabled." }, { status: 503 });
  }

  if (!checkRateLimit("doc-mic-transcribe", userId, LIMIT_PER_MINUTE)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "No audio provided." }, { status: 400 });
    }
    if (audio.size > MAX_CHUNK_BYTES) {
      return NextResponse.json({ error: "Audio chunk too large." }, { status: 413 });
    }

    const text = await transcribeAudioChunk(audio);
    if (text === null) {
      return NextResponse.json({ error: "Transcription is not configured." }, { status: 503 });
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[doc-mic-transcribe]", err);
    return NextResponse.json({ error: "Transcription failed." }, { status: 500 });
  }
}

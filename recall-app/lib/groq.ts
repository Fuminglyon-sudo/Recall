// Groq Whisper transcription — used for Doc Lab's mic mode when
// NEXT_PUBLIC_DOC_LAB_GROQ_MIC is "true". Groq's audio endpoint is a fast
// batch transcription API (not real low-latency streaming — Groq doesn't
// offer that), so the client sends short pause-segmented chunks rather than
// one continuous stream. whisper-large-v3-turbo is used specifically for its
// speed, since keeping each chunk's round-trip short is what makes the
// experience feel live.

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_MODEL = "whisper-large-v3-turbo";

export async function transcribeAudioChunk(file: File): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", GROQ_MODEL);
  formData.append("response_format", "text");
  // Business-document vocabulary reads better with a language hint than
  // letting Whisper guess from a 1-3 second clip.
  formData.append("language", "en");

  const response = await fetch(GROQ_TRANSCRIPTION_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Groq transcription failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  const text = await response.text();
  return text.trim();
}

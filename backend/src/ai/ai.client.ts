import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("CRITICAL: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateAIAnalysis(
    systemPrompt: string,
    userContent: string,
    retries = 3,
    delayMs = 2000
): Promise<string> {
    try {
        const response = await ai.models.generateContent({
           model: 'gemini-3.5-flash-lite', 
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
            },
            contents: userContent,
        });

        const responseText = response.text;

        if (!responseText) {
            throw new Error("AI boş bir yanıt döndürdü.");
        }

        return responseText;
    } catch (error: any) {
        console.error(`AI Generation Error (Kalan deneme hakkı: ${retries - 1}):`, error?.message || error);

        const isTemporaryError =
            error?.status === 503 ||
            error?.code === 503 ||
            (error?.message && error.message.includes("503")) ||
            (error?.message && error.message.includes("high demand"));

        if (isTemporaryError && retries > 1) {
            console.warn(`Google Gemini sunucuları yoğun (503). ${delayMs / 1000} saniye sonra tekrar deneniyor...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            return generateAIAnalysis(systemPrompt, userContent, retries - 1, delayMs * 1.5);
        }

        throw new Error(`AI can not response right now: ${error.message || "Bilinmeyen hata"}`);
    }
}
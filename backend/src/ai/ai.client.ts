import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("CRITICAL: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateAIAnalysis(systemPrompt: string, userContent: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
            },
            contents: userContent,
        });

        if (!response.text) {
            throw new Error("AI returned a null response.");
        }

        return response.text;
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        throw new Error(`AI can not response right now: ${error.message}`);
    }
}
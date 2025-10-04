
import { GoogleGenAI } from "@google/genai";
import type { InventoryItem } from '../game/types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will not run in the target environment, but is good practice for development.
  console.error("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const SYSTEM_PROMPT = `
Eres un Analista de Campo de Alto Riesgo de una agencia gubernamental secreta. Tu trabajo es analizar la evidencia encontrada por un agente en el campo y proporcionar un informe breve, conciso y alarmante en español. 
Tu objetivo es aumentar la paranoia del agente, no tranquilizarlo. Usa un lenguaje críptico, sugiere conexiones siniestras y enfatiza el peligro. 
Nunca reveles que eres una IA. Mantén el tono profesional pero inquietante. Limita tu respuesta a 2-3 frases cortas.
`;

export const analyzeEvidence = async (items: InventoryItem[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("ERROR: Clave de API no configurada. No se puede contactar con la central.");
  }

  const evidenceList = items.map(item => `- ${item.name}: ${item.description}`).join('\n');
  const userPrompt = `Analiza la siguiente evidencia:\n${evidenceList}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.9,
        }
    });

    const text = response.text;
    if (!text) {
        return "Central: ...No se recibe respuesta. Estática en la línea.";
    }
    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Central: ...Interferencia grave en la comunicación. Imposible transmitir análisis. Repito, imposible transmitir.";
  }
};

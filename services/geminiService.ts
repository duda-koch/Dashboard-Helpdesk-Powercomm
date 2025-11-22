
import { GoogleGenAI, Type } from "@google/genai";
import { SupportTicket, InsightResponse } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTicketData = async (
  tickets: SupportTicket[]
): Promise<InsightResponse | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  // Summarize data to send to LLM to avoid context limit issues if list grows
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'Resolvido').length;
  const n3Count = tickets.filter(t => t.nivel === 'N3').length;
  
  // Create a lightweight CSV string for the model
  const csvData = tickets.map(t => 
    `${t.cliente},${t.prioridade},${t.status},${t.tag},${t.nivel},${t.sla},${t.tecnico}`
  ).join('\n');

  const prompt = `
    Act as a Chief Operating Officer (COO) or Head of Customer Success. 
    Analyze the following Support Ticket data for November.

    Context:
    - Total Tickets: ${total}
    - Resolved: ${resolved}
    - N3 Level Count: ${n3Count}
    
    Raw Data (Client,Priority,Status,Tag,Level,SLA,Technician):
    ${csvData}

    Generate a critical EXECUTIVE SUMMARY for the CEO in Brazilian Portuguese (pt-BR).
    
    Provide a JSON response with:
    1. executiveSummary: A high-level paragraph summarizing the health of the support operation (in PT-BR).
    2. bottlenecks: List of specific bottlenecks (in PT-BR).
    3. risks: Operational or Churn risks based on the data (in PT-BR).
    4. rootCauses: Likely causes for the issues found (in PT-BR).
    5. recommendations: Strategic actions to take immediately (in PT-BR).
    6. priorityActions: Top 3 tactical moves for this week (in PT-BR).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as InsightResponse;

  } catch (error) {
    console.error("Error analyzing tickets:", error);
    return null;
  }
};

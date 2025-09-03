
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DiagramType } from '../types';

// この部分はサーバーサイド（Node.js環境）で実行されます
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getDiagramTypeName = (type: DiagramType): string => {
  switch (type) {
    case DiagramType.Flowchart:
      return 'Flowchart';
    case DiagramType.Sequence:
      return 'Sequence Diagram';
    case DiagramType.Gantt:
      return 'Gantt Chart';
    default:
      return 'Diagram';
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userInput, diagramType } = req.body;

  if (!userInput || !diagramType) {
    return res.status(400).json({ error: 'Missing userInput or diagramType' });
  }

  const diagramTypeName = getDiagramTypeName(diagramType as DiagramType);
  const prompt = `
    あなたはMermaid.jsの構文のエキスパートです。ユーザーが提供した以下のテキストを、有効なMermaid.jsの${diagramTypeName}に変換してください。
    他の説明は一切せず、ダイアグラムのコードブロックのみを出力してください。
    コードブロックは \`\`\`mermaid ... \`\`\` の形式でなければなりません。
    
    ユーザーのテキスト:
    "${userInput}"
  `;

  try {
    const result = await ai.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const match = text.match(/```mermaid\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return res.status(200).json({ code: match[1].trim() });
    }
    
    return res.status(200).json({ code: text.trim() });

  } catch (error) {
    console.error("Error generating Mermaid code:", error);
    return res.status(500).json({ error: "Failed to communicate with the AI model." });
  }
}

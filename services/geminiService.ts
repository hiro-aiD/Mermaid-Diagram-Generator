
import { GoogleGenAI } from "@google/genai";
import { DiagramType } from '../types';

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

export const generateMermaidCode = async (userInput: string, diagramType: DiagramType): Promise<string> => {
  const diagramTypeName = getDiagramTypeName(diagramType);
  const prompt = `
    あなたはMermaid.jsの構文のエキスパートです。ユーザーが提供した以下のテキストを、有効なMermaid.jsの${diagramTypeName}に変換してください。
    他の説明は一切せず、ダイアグラムのコードブロックのみを出力してください。
    コードブロックは \`\`\`mermaid ... \`\`\` の形式でなければなりません。
    
    ユーザーのテキスト:
    "${userInput}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    
    // Extract content from markdown code block
    const match = text.match(/```mermaid\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // Fallback for cases where it might not return the markdown block
    return text.trim();

  } catch (error) {
    console.error("Error generating Mermaid code:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

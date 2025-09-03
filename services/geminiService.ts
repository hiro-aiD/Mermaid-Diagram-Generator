import { DiagramType } from '../types';

export const generateMermaidCode = async (userInput: string, diagramType: DiagramType): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, diagramType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate diagram');
    }

    const data = await response.json();
    return data.code;

  } catch (error) {
    console.error("Error generating Mermaid code:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};
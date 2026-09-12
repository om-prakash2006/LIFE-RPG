import { GoogleGenAI, Type } from '@google/genai';

export type RPGAttribute = 'Strength' | 'Intellect' | 'Vitality' | 'Charisma';
export type DifficultyTier = 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Epic';

export interface AnalyzedTask {
  title: string;
  description: string;
  attribute: RPGAttribute;
  difficulty: DifficultyTier;
  xpReward: number;
  goldReward: number;
  estimatedMinutes?: number;
  reasoning: string;
}

/**
 * Safely resolves the Gemini API key from environment variables across
 * Node / Vite / AI Studio environments.
 */
export function getGeminiApiKey(): string {
  try {
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY.trim();
    }
  } catch {
    // ignore
  }

  try {
    const meta = (import.meta as any).env;
    if (meta?.VITE_GEMINI_API_KEY) {
      return meta.VITE_GEMINI_API_KEY.trim();
    }
    if (meta?.GEMINI_API_KEY) {
      return meta.GEMINI_API_KEY.trim();
    }
  } catch {
    // ignore
  }

  return '';
}

/**
 * Schema enforcing strict structured JSON response for task analysis.
 */
const analyzedTaskSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Refined, action-oriented RPG quest title summarizing the task cleanly.',
    },
    description: {
      type: Type.STRING,
      description: 'Concise summary of what the user achieved or aims to accomplish.',
    },
    attribute: {
      type: Type.STRING,
      enum: ['Strength', 'Intellect', 'Vitality', 'Charisma'],
      description:
        'The core RPG attribute trained: Strength (workouts, physical exertion), Intellect (studying, coding, problem solving, reading), Vitality (sleep, nutrition, mindfulness, wellness), Charisma (networking, public speaking, teamwork, social interaction).',
    },
    difficulty: {
      type: Type.STRING,
      enum: ['Trivial', 'Easy', 'Medium', 'Hard', 'Epic'],
      description: 'Difficulty tier reflecting duration, physical strain, and willpower required.',
    },
    xpReward: {
      type: Type.INTEGER,
      description: 'Calculated XP reward: Trivial=20-40, Easy=50-80, Medium=100-150, Hard=200-300, Epic=400-600.',
    },
    goldReward: {
      type: Type.INTEGER,
      description: 'Calculated Gold reward: Trivial=10-20, Easy=25-40, Medium=50-80, Hard=100-150, Epic=200-300.',
    },
    estimatedMinutes: {
      type: Type.INTEGER,
      description: 'Estimated minutes to complete this task.',
    },
    reasoning: {
      type: Type.STRING,
      description: 'One sentence explanation justifying the attribute, difficulty tier, and reward values.',
    },
  },
  required: ['title', 'description', 'attribute', 'difficulty', 'xpReward', 'goldReward', 'reasoning'],
};

/**
 * Uses Gemini (gemini-2.5-flash) to parse a plain-English task string into
 * a structured RPG task with categorized attribute, difficulty tier, and rewards.
 */
export async function analyzeTaskWithAI(taskInput: string): Promise<AnalyzedTask> {
  const trimmedInput = taskInput?.trim();
  if (!trimmedInput) {
    throw new Error('Task input cannot be empty.');
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'Missing Gemini API Key. Please configure GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in your environment settings.'
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `Analyze this real-world task completed by a player in the "Life RPG" productivity system:
"${trimmedInput}"

Categorize it into one of the four core attributes: Strength, Intellect, Vitality, or Charisma.
Determine an appropriate difficulty tier (Trivial, Easy, Medium, Hard, Epic) and calculate balanced XP (20 to 600) and Gold (10 to 300) rewards according to effort, duration, and discipline.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analyzedTaskSchema,
        systemInstruction:
          'You are an expert RPG Game Master and Productivity AI in the "Life RPG" system. You evaluate real-life human achievements and convert them into balanced, engaging gamified RPG attributes, XP, and Gold rewards. Return only valid JSON conforming strictly to the requested schema.',
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    let parsed: AnalyzedTask;
    try {
      parsed = JSON.parse(rawText) as AnalyzedTask;
    } catch (parseError: any) {
      throw new Error(`Malformed JSON response from AI: ${parseError?.message || 'Parse error'}`);
    }

    // Validate required fields
    if (!parsed.title || !parsed.attribute || !parsed.difficulty || typeof parsed.xpReward !== 'number') {
      throw new Error('AI response is missing required task attributes.');
    }

    // Ensure numbers are bounded and non-negative
    parsed.xpReward = Math.max(10, Math.round(parsed.xpReward));
    parsed.goldReward = Math.max(5, Math.round(parsed.goldReward ?? 25));

    return parsed;
  } catch (error: any) {
    if (error.message?.includes('API key not valid') || error.status === 400 || error.status === 403) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY credentials.');
    }
    throw error;
  }
}

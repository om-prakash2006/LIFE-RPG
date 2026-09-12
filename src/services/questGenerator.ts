import { GoogleGenAI, Type } from '@google/genai';
import { RPGAttribute, DifficultyTier, getGeminiApiKey } from './aiService';

export interface GeneratedDailyQuest {
  title: string;
  description: string;
  attribute: RPGAttribute;
  difficulty: DifficultyTier;
  xpReward: number;
  goldReward: number;
}

/**
 * Schema enforcing a 3-item array of structured RPG quests.
 */
const dynamicQuestsArraySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'Atmospheric, heroic quest title describing a real-world productivity or fitness objective.',
      },
      description: {
        type: Type.STRING,
        description: 'Specific, actionable instructions for completing this real-life goal disguised as an RPG quest.',
      },
      attribute: {
        type: Type.STRING,
        enum: ['Strength', 'Intellect', 'Vitality', 'Charisma'],
        description: 'Core attribute targeted by this quest.',
      },
      difficulty: {
        type: Type.STRING,
        enum: ['Easy', 'Medium', 'Hard', 'Epic'],
        description: 'Difficulty tier.',
      },
      xpReward: {
        type: Type.INTEGER,
        description: 'Scaled XP reward tailored to the user’s character level.',
      },
      goldReward: {
        type: Type.INTEGER,
        description: 'Scaled Gold reward tailored to the user’s character level.',
      },
    },
    required: ['title', 'description', 'attribute', 'difficulty', 'xpReward', 'goldReward'],
  },
};

/**
 * Uses Gemini (gemini-2.5-flash) to generate 3 dynamic daily quests tailored
 * to the user's level and archetype class.
 */
export async function generateDailyQuests(
  characterLevel: number = 1,
  characterClass: string = 'Cyber Sage',
  personalGoal?: string
): Promise<GeneratedDailyQuest[]> {
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

  const levelMultiplier = 1 + (characterLevel - 1) * 0.15;
  const baseXP = Math.round(50 * levelMultiplier);
  const baseGold = Math.round(25 * levelMultiplier);

  const prompt = `Generate exactly 3 diverse, actionable, real-life daily productivity quests for a player in the "Life RPG" system.

Player Dossier:
- Character Level: ${characterLevel}
- Archetype Class: "${characterClass}"
${personalGoal ? `- Specific Player Focus: "${personalGoal}"` : ''}
- Target Base Rewards: ~${baseXP} XP and ~${baseGold} Gold (scale higher for Medium/Hard/Epic quests)

Requirements:
1. Every quest must correlate to a healthy, tangible real-world action (e.g. focused study, weight training, mindful hydration, team mentoring).
2. The quests must reflect the player's class themes (Cyber Sage = coding/intellect/logic; Iron Titan = strength/endurance/discipline; Shadow Stalker = agility/focus/execution).
3. The 3 quests should ideally target different attributes (choose from: Strength, Intellect, Vitality, Charisma).
4. Scale rewards accurately for a Level ${characterLevel} hero.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: dynamicQuestsArraySchema,
        systemInstruction:
          'You are the Grandmaster Quest Guild AI in "Life RPG". You design compelling, balanced daily quests that transform mundane real-world tasks into exciting gamified hero missions. Always return an array of 3 quests conforming strictly to the JSON schema.',
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    let quests: GeneratedDailyQuest[];
    try {
      quests = JSON.parse(rawText) as GeneratedDailyQuest[];
    } catch (parseError: any) {
      throw new Error(`Malformed JSON response from AI Quest Generator: ${parseError?.message || 'Parse error'}`);
    }

    if (!Array.isArray(quests) || quests.length === 0) {
      throw new Error('AI returned an invalid quest list structure.');
    }

    // Ensure reward values are clean positive numbers
    return quests.map((q) => ({
      ...q,
      xpReward: Math.max(25, Math.round(q.xpReward)),
      goldReward: Math.max(10, Math.round(q.goldReward)),
    }));
  } catch (error: any) {
    if (error.message?.includes('API key not valid') || error.status === 400 || error.status === 403) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY credentials.');
    }
    throw error;
  }
}

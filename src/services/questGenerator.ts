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

function fallbackDailyQuests(
  characterLevel: number = 1,
  characterClass: string = 'Cyber Sage',
  personalGoal?: string
): GeneratedDailyQuest[] {
  const levelMultiplier = 1 + (characterLevel - 1) * 0.15;
  const baseXP = Math.round(50 * levelMultiplier);
  const baseGold = Math.round(25 * levelMultiplier);

  if (characterClass === 'Iron Titan') {
    return [
      {
        title: 'Compound Heavy Lifts & Calisthenics',
        description: 'Complete 4 sets of compound movements (pushups, squats, or deadlifts) with unbroken focus.',
        attribute: 'Strength',
        difficulty: 'Hard',
        xpReward: Math.round(baseXP * 1.5),
        goldReward: Math.round(baseGold * 1.4),
      },
      {
        title: 'Hydration Citadel & Clean Recovery',
        description: 'Drink at least 2.5L of water and complete 10 minutes of post-workout muscle stretching.',
        attribute: 'Vitality',
        difficulty: 'Easy',
        xpReward: Math.round(baseXP * 0.8),
        goldReward: Math.round(baseGold * 0.8),
      },
      {
        title: 'Armor of Will: Zero Distractions',
        description: 'Execute a 90-minute unbroken work sprint without opening social media or checking phone notifications.',
        attribute: 'Charisma',
        difficulty: 'Medium',
        xpReward: baseXP,
        goldReward: baseGold,
      },
    ];
  }

  if (characterClass === 'Shadow Stalker') {
    return [
      {
        title: 'Deep Infiltration: 2-Hour Deep Work',
        description: personalGoal ? `Conquer focused progress on: ${personalGoal}` : 'Execute 120 minutes of undisturbed creative or technical execution.',
        attribute: 'Intellect',
        difficulty: 'Hard',
        xpReward: Math.round(baseXP * 1.6),
        goldReward: Math.round(baseGold * 1.5),
      },
      {
        title: 'Stealth Agility: 5km Cardio Run',
        description: 'Hit the pavement or treadmill for a brisk 5k to maintain quick reflexes and stamina.',
        attribute: 'Strength',
        difficulty: 'Medium',
        xpReward: Math.round(baseXP * 1.2),
        goldReward: Math.round(baseGold * 1.1),
      },
      {
        title: 'Night Raven Rest: 8 Hours Deep Sleep',
        description: 'Turn off blue-light screens 45 minutes before sleep and ensure 8 hours of restorative rest.',
        attribute: 'Vitality',
        difficulty: 'Easy',
        xpReward: Math.round(baseXP * 0.9),
        goldReward: Math.round(baseGold * 0.8),
      },
    ];
  }

  // Default Cyber Sage
  return [
    {
      title: 'Algorithm Optimization: 2 DSA Problems',
      description: personalGoal ? `Target objective: ${personalGoal}` : 'Solve 2 algorithmic challenges analyzing time and space complexities.',
      attribute: 'Intellect',
      difficulty: 'Medium',
      xpReward: Math.round(baseXP * 1.2),
      goldReward: Math.round(baseGold * 1.2),
    },
    {
      title: 'Ergonomic Calibration & Posture Reset',
      description: 'Step away from screen every 45 minutes, stretch neck and shoulders, and drink 500ml water.',
      attribute: 'Vitality',
      difficulty: 'Easy',
      xpReward: Math.round(baseXP * 0.8),
      goldReward: Math.round(baseGold * 0.7),
    },
    {
      title: 'Codebase Architecture Review',
      description: 'Refactor one module, improve test coverage, or document key API endpoints.',
      attribute: 'Intellect',
      difficulty: 'Hard',
      xpReward: Math.round(baseXP * 1.5),
      goldReward: Math.round(baseGold * 1.4),
    },
  ];
}

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
    console.info('[questGenerator] No GEMINI_API_KEY found, using balanced procedural quests.');
    return fallbackDailyQuests(characterLevel, characterClass, personalGoal);
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
      return fallbackDailyQuests(characterLevel, characterClass, personalGoal);
    }

    let quests: GeneratedDailyQuest[];
    try {
      quests = JSON.parse(rawText) as GeneratedDailyQuest[];
    } catch (parseError: any) {
      return fallbackDailyQuests(characterLevel, characterClass, personalGoal);
    }

    if (!Array.isArray(quests) || quests.length === 0) {
      return fallbackDailyQuests(characterLevel, characterClass, personalGoal);
    }

    // Ensure reward values are clean positive numbers
    return quests.map((q) => ({
      ...q,
      xpReward: Math.max(25, Math.round(q.xpReward)),
      goldReward: Math.max(10, Math.round(q.goldReward)),
    }));
  } catch (error: any) {
    console.warn('[questGenerator] Gemini API call failed, falling back to procedural quests:', error);
    return fallbackDailyQuests(characterLevel, characterClass, personalGoal);
  }
}

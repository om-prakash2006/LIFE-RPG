import React from 'react';
import {
  Brain,
  Dumbbell,
  Flame,
  Heart,
  BookOpen,
  Shield,
  Award,
  Palette,
  Crown,
  Sword,
  Feather,
  Glasses,
  Trophy,
  Swords,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { QuestCategory } from '../types';

interface CategoryIconProps {
  category?: QuestCategory | string;
  iconName?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, iconName, className = 'w-5 h-5' }) => {
  if (iconName) {
    switch (iconName.toLowerCase()) {
      case 'brain':
        return <Brain className={className} />;
      case 'dumbbell':
        return <Dumbbell className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'heart':
        return <Heart className={className} />;
      case 'bookopen':
      case 'book':
        return <BookOpen className={className} />;
      case 'shield':
        return <Shield className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'palette':
        return <Palette className={className} />;
      case 'crown':
        return <Crown className={className} />;
      case 'sword':
      case 'swords':
        return <Swords className={className} />;
      case 'feather':
        return <Feather className={className} />;
      case 'glasses':
        return <Glasses className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      case 'graduationcap':
        return <GraduationCap className={className} />;
      case 'shieldalert':
        return <ShieldAlert className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  }

  switch (category) {
    case 'intellect':
      return <Brain className={className} />;
    case 'strength':
      return <Dumbbell className={className} />;
    case 'discipline':
      return <Flame className={className} />;
    case 'vitality':
      return <Heart className={className} />;
    case 'knowledge':
      return <BookOpen className={className} />;
    default:
      return <Zap className={className} />;
  }
};

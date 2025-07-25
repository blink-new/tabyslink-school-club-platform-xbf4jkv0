export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  school_name?: string;
  grade?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  creator_id: string;
  school_name?: string;
  member_count: number;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'moderator';
  joined_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  club_id: string;
  creator_id: string;
  event_date: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  is_online: boolean;
  meeting_link?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'club_participation' | 'event_attendance' | 'leadership' | 'certificate';
  badge_icon?: string;
  badge_color?: string;
  points: number;
  club_id?: string;
  event_id?: string;
  earned_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  club_id?: string;
  event_id?: string;
  certificate_url?: string;
  issued_at: string;
}

export interface AIChat {
  id: string;
  user_id: string;
  chat_type: 'club_analysis' | 'university_consultant';
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ClubCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CLUB_CATEGORIES: ClubCategory[] = [
  { id: 'all', name: 'Все категории', icon: '🎯', color: '#8B5DA5' },
  { id: 'technology', name: 'Технологии', icon: '💻', color: '#3B82F6' },
  { id: 'science', name: 'Наука', icon: '🔬', color: '#10B981' },
  { id: 'arts', name: 'Искусство', icon: '🎨', color: '#F59E0B' },
  { id: 'sports', name: 'Спорт', icon: '⚽', color: '#EF4444' },
  { id: 'education', name: 'Образование', icon: '📚', color: '#8B5CF6' },
  { id: 'social', name: 'Социальные', icon: '🤝', color: '#06B6D4' },
  { id: 'environment', name: 'Экология', icon: '🌱', color: '#22C55E' },
];
import { ActivityType } from './types';

// Map activity types to specific colors for visualization
export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  [ActivityType.BOXING]: '#ec4899', // Pink
  [ActivityType.FALL]: '#ef4444', // Red (Critical)
  [ActivityType.JUMP]: '#f59e0b', // Amber
  [ActivityType.LEFT_FORERAKE]: '#8b5cf6', // Violet
  [ActivityType.LEFT_HAND_WAVE]: '#6366f1', // Indigo
  [ActivityType.OPEN_ARMS]: '#14b8a6', // Teal
  [ActivityType.RIGHT_FORERAKE]: '#a855f7', // Purple
  [ActivityType.RIGHT_HAND_WAVE]: '#3b82f6', // Blue
  [ActivityType.SIT]: '#10b981', // Emerald
  [ActivityType.SQUAT]: '#f97316', // Orange
  [ActivityType.STAND]: '#06b6d4', // Cyan
  [ActivityType.WALK]: '#22c55e', // Green
  [ActivityType.IDLE]: '#64748b', // Slate
};

// Descriptions for the UI
export const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  [ActivityType.BOXING]: '检测到快速的肢体伸缩与击打动作。',
  [ActivityType.FALL]: '检测到突发加速度与高度骤降。紧急情况！',
  [ActivityType.JUMP]: '检测到明显的垂直位移。',
  [ActivityType.LEFT_FORERAKE]: '检测到身体向左前方倾斜。',
  [ActivityType.LEFT_HAND_WAVE]: '检测到左手挥动动作。',
  [ActivityType.OPEN_ARMS]: '检测到双臂张开动作。',
  [ActivityType.RIGHT_FORERAKE]: '检测到身体向右前方倾斜。',
  [ActivityType.RIGHT_HAND_WAVE]: '检测到右手挥动动作。',
  [ActivityType.SIT]: '检测到坐下动作或坐姿。',
  [ActivityType.SQUAT]: '检测到下蹲动作。',
  [ActivityType.STAND]: '检测到站立姿态。',
  [ActivityType.WALK]: '检测到正常步态模式。',
  [ActivityType.IDLE]: '无显著人体活动信号。',
};
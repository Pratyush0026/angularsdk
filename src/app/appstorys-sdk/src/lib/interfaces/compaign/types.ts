export type CampaignType = 'FLT' | 'BAN' | 'SUR' | 'STR';

export const CAMPAIGN_TYPES = {
  FLOATER: 'FLT' as const,
  BANNER: 'BAN' as const,
  SURVEY: 'SUR' as const,
  STORY: 'STR' as const
} as const;
export type CampaignType = 'FLT' | 'BAN' | 'WGT';

export const CAMPAIGN_TYPES = {
  FLOATER: 'FLT' as const,
  BANNER: 'BAN' as const,
  WIDGET: 'WGT' as const
} as const;
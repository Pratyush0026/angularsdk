import { CampaignType } from './types';
import { MediaCampaignDetails} from './campaign-details.interface';

export interface BaseCampaign {
  id: string;
  campaign_type: CampaignType;
}

export interface MediaCampaign extends BaseCampaign {
  campaign_type: 'FLT' | 'BAN' | 'WID' | 'STR';
  details: MediaCampaignDetails;
}

// export interface StoryGroup {
//   thumbnail: string;
//   name: string;
//   ringColor: string;
//   nameColor: string;
//   slides: any[];
// }

// export interface StoryCampaign extends BaseCampaign {
//   campaign_type: 'STR';
//   details: StoryGroup[];
// }

// export interface SurveyCampaign extends BaseCampaign {
//   campaign_type: 'SUR';
//   details: SurveyCampaignDetails;
// }

export type Campaign = MediaCampaign; //| StoryCampaign | SurveyCampaign;

// Type guard functions
// export function isSurveyCampaign(campaign: Campaign): campaign is SurveyCampaign {
//   return campaign.campaign_type === 'SUR';
// }

export function isMediaCampaign(campaign: Campaign): campaign is MediaCampaign {
  return campaign.campaign_type === 'FLT' || campaign.campaign_type === 'BAN' || campaign.campaign_type === 'WID' ;
}

// export function isStoryCampaign(campaign: Campaign): campaign is StoryCampaign {
//   return campaign.campaign_type === 'STR';
// }
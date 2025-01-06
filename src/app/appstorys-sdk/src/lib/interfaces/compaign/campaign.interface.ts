import { CampaignType } from './types';
import { CampaignDetails } from './campaign-details.interface';

export interface Campaign {
  id: string;
  campaign_type: CampaignType;
  details: CampaignDetails;
}
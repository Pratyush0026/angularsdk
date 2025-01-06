import { Campaign, CampaignType } from "../../interfaces/compaign";


export const findCampaignByType = (
  campaigns: Campaign[] | undefined | null,
  type: CampaignType
): Campaign | undefined => {
  if (!Array.isArray(campaigns)) return undefined;
  return campaigns.find(campaign => campaign.campaign_type === type);
};
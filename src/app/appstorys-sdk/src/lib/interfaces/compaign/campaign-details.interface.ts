// Base interface for common properties
export interface BaseCampaignDetails {
  id: string;
  image: string;
  link?: string | null;
}

// Media campaign details (for Banner/Floater)
export interface MediaCampaignDetails extends BaseCampaignDetails {
  width?: number | null;
  height?: number | null;
  type?: 'full' | 'half';
  position?: 'left' | 'right' | 'center';
  widget_images?: WidgetImage[];
}

interface WidgetImage {
  id: string;
  image: string;
  link: string;
  order: number;
}

// Story campaign details
export interface StorySlide {
  id: string;
  image?: string;
  video?: string;
  link?: string;
  button_text?: string;
}

export interface StoryGroup {
  id: string;
  name: string;
  thumbnail: string;
  slides: StorySlide[];
  ringColor?: string;
  nameColor?: string;
}

// Survey campaign details
export interface SurveyCampaignDetails extends BaseCampaignDetails {
  surveyQuestion: string;
  surveyOptions: { [key: string]: string };
  hasOthers?: boolean;
  styling: {
    backgroundColor: string;
    surveyQuestionColor: string;
    optionColor: string;
    optionTextColor: string;
    selectedOptionColor: string;
    selectedOptionTextColor: string;
    othersBackgroundColor?: string;
    ctaBackgroundColor: string;
    ctaTextIconColor: string;
  };
}
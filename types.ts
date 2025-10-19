export enum AppTab {
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export type PoseOption = {
  id: string;
  nameKey: string;
  promptFragment: string;
};

export type PoseCategory = {
  id: string;
  nameKey: string;
  options: PoseOption[];
};

export type ThemeOption = {
  id: string;
  nameKey: string;
  promptFragment: string;
};

export type ThemeCategory = {
  id: string;
  nameKey: string;
  options: ThemeOption[];
};

export type ThemeConfig = {
  [key: string]: string;
};

export type AiGenerationMode = 'partner' | 'child';
export type AiPartnerType = string;
export type AiChildGender = string;
export type AiPartnerEthnicity = string;

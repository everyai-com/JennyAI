export interface Voice {
  voiceId: string;
  name: string;
  previewUrl: string;
}

export interface VoiceOption {
  voiceId: string;
  name: string;
  previewUrl?: string;
}

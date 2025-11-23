export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface OCRResult {
  text: string;
  confidence?: number;
}

export interface ImageSource {
  data: string; // Base64
  mimeType: string;
}
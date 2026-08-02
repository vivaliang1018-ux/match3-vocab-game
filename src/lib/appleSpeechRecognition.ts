import {
  Capacitor,
  registerPlugin,
  type PluginListenerHandle,
} from '@capacitor/core';

export type SpeechPermissionState = 'prompt' | 'granted' | 'denied';

export type AppleSpeechPermissions = {
  speechRecognition: SpeechPermissionState;
  microphone: SpeechPermissionState;
};

export type AppleSpeechSegment = {
  text: string;
  timestamp: number;
  duration: number;
  confidence?: number;
};

export type AppleSpeechResult = {
  transcript: string;
  isFinal: boolean;
  cycleId: number;
  segments: AppleSpeechSegment[];
  confidence?: number;
};

type SpeechState = {
  listening: boolean;
  cycleId?: number;
  error?: string;
};

type SpeechLevel = {
  level: number;
};

export type AppleSpeechCycle = {
  cycleId: number;
};

interface AppleSpeechRecognitionPlugin {
  checkPermissions(): Promise<AppleSpeechPermissions>;
  requestPermissions(): Promise<AppleSpeechPermissions>;
  start(options: { words: string[] }): Promise<AppleSpeechCycle>;
  beginAnswer(options: { words: string[] }): Promise<AppleSpeechCycle>;
  updateVocabulary(options: { words: string[] }): Promise<void>;
  playCountdownTone(options: { kind: 'beep' | 'start' }): Promise<void>;
  stop(): Promise<void>;
  addListener(
    eventName: 'speechResult',
    listenerFunc: (event: AppleSpeechResult) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'speechState',
    listenerFunc: (event: SpeechState) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'speechLevel',
    listenerFunc: (event: SpeechLevel) => void,
  ): Promise<PluginListenerHandle>;
}

const AppleSpeechRecognition =
  registerPlugin<AppleSpeechRecognitionPlugin>('AppleSpeechRecognition');

export function isAppleSpeechRecognitionAvailable(): boolean {
  return (
    Capacitor.getPlatform() === 'ios' &&
    Capacitor.isNativePlatform() &&
    Capacitor.isPluginAvailable('AppleSpeechRecognition')
  );
}

export async function requestAppleSpeechPermissions(): Promise<AppleSpeechPermissions> {
  if (!isAppleSpeechRecognitionAvailable()) {
    return { speechRecognition: 'denied', microphone: 'denied' };
  }
  return AppleSpeechRecognition.requestPermissions();
}

export async function startAppleSpeechRecognition(
  words: readonly string[] = [],
): Promise<AppleSpeechCycle> {
  if (!isAppleSpeechRecognitionAvailable()) {
    throw new Error('apple-speech-unavailable');
  }
  return AppleSpeechRecognition.start({ words: [...words] });
}

export async function beginAppleSpeechAnswer(
  words: readonly string[],
): Promise<AppleSpeechCycle> {
  if (!isAppleSpeechRecognitionAvailable()) {
    throw new Error('apple-speech-unavailable');
  }
  return AppleSpeechRecognition.beginAnswer({ words: [...words] });
}

export async function updateAppleSpeechVocabulary(words: readonly string[]): Promise<void> {
  if (!isAppleSpeechRecognitionAvailable()) return;
  try {
    await AppleSpeechRecognition.updateVocabulary({ words: [...words] });
  } catch {
    // Context hints are an optimization; recognition can continue without them.
  }
}

export async function playAppleSpeechCountdownTone(
  kind: 'beep' | 'start',
): Promise<boolean> {
  if (!isAppleSpeechRecognitionAvailable()) return false;
  try {
    await AppleSpeechRecognition.playCountdownTone({ kind });
    return true;
  } catch {
    return false;
  }
}

export async function stopAppleSpeechRecognition(): Promise<void> {
  if (!isAppleSpeechRecognitionAvailable()) return;
  try {
    await AppleSpeechRecognition.stop();
  } catch {
    // Cleanup must never block leaving the game.
  }
}

export async function addAppleSpeechResultListener(
  listener: (event: AppleSpeechResult) => void,
): Promise<PluginListenerHandle | null> {
  if (!isAppleSpeechRecognitionAvailable()) return null;
  return AppleSpeechRecognition.addListener('speechResult', listener);
}

export async function addAppleSpeechStateListener(
  listener: (event: SpeechState) => void,
): Promise<PluginListenerHandle | null> {
  if (!isAppleSpeechRecognitionAvailable()) return null;
  return AppleSpeechRecognition.addListener('speechState', listener);
}

export async function addAppleSpeechLevelListener(
  listener: (event: SpeechLevel) => void,
): Promise<PluginListenerHandle | null> {
  if (!isAppleSpeechRecognitionAvailable()) return null;
  return AppleSpeechRecognition.addListener('speechLevel', listener);
}

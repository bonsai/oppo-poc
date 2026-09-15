export type Voice = {
  id: string;
  deviceId: string;
  transcript: string;
  createdAt: string;
};

export class VoiceBoard {
  private readonly voices: Voice[] = [];

  addVoice(deviceId: string, transcript: string): Voice {
    if (!deviceId || !transcript.trim()) throw new Error('deviceId and transcript are required');
    const voice: Voice = {
      id: crypto.randomUUID(),
      deviceId,
      transcript: transcript.trim(),
      createdAt: new Date().toISOString(),
    };
    this.voices.unshift(voice);
    return voice;
  }

  listVoices(): Voice[] {
    return [...this.voices];
  }
}

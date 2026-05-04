/** 44.1kHz mono PCM WAV üretir — zarf açılışı için hafif piyano benzeri akor (HTML5 audio ile oynatılır). */

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]!));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Yumuşak C majör arpej + süzülme — davetiye açılışına uygun kısa ambient.
 * Dönüş: `blob:` URL; kullanıcı `URL.revokeObjectURL` ile temizlemeli.
 */
export function createInviteOpeningPianoBlobUrl(): string {
  const sampleRate = 44100;
  const durationSec = 3.4;
  const numChannels = 1;
  const numFrames = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(numFrames);

  const notes = [
    { f: 261.63, t0: 0.0, len: 2.8 },
    { f: 329.63, t0: 0.18, len: 2.55 },
    { f: 392.0, t0: 0.36, len: 2.35 },
    { f: 523.25, t0: 0.52, len: 2.1 },
  ];

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    let sample = 0;
    for (const n of notes) {
      if (t < n.t0) continue;
      const local = t - n.t0;
      const atk = 0.09;
      let env = 1;
      if (local < atk) env = local / atk;
      else env = Math.pow(1 - Math.min(1, (local - atk) / (n.len - atk)), 1.35) * Math.exp(-local * 0.35);
      const vib = 1 + 0.004 * Math.sin(t * 5.2);
      const f = n.f * vib;
      sample +=
        env *
        0.22 *
        (Math.sin(2 * Math.PI * f * local) +
          0.12 * Math.sin(2 * Math.PI * f * 2 * local) +
          0.06 * Math.sin(2 * Math.PI * f * 3 * local));
    }
    buffer[i] = sample;
  }

  const dataSize = numFrames * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  floatTo16BitPCM(view, 44, buffer);

  const blob = new Blob([arrayBuffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

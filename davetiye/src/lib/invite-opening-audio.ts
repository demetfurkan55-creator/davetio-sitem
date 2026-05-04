/** 44.1kHz mono PCM WAV üretir — davetiye açılışı için sıcak, düğün salonu tonunda arpej + süzülme. */

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

function buildWavFromBuffer(buffer: Float32Array, sampleRate: number): string {
  const numChannels = 1;
  const numFrames = buffer.length;
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

  return URL.createObjectURL(new Blob([arrayBuffer], { type: "audio/wav" }));
}

/**
 * G-dur tabanlı yumuşak arpej (C4–D5) + hafif parlak harmonikler — “davet” hissiyatı.
 */
export function createInviteOpeningPianoBlobUrl(): string {
  const sampleRate = 44100;
  const durationSec = 5.2;
  const numFrames = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(numFrames);

  const notes = [
    { f: 196.0, t0: 0.0, len: 4.9 },
    { f: 246.94, t0: 0.16, len: 4.65 },
    { f: 293.66, t0: 0.32, len: 4.45 },
    { f: 392.0, t0: 0.48, len: 4.25 },
    { f: 493.88, t0: 0.64, len: 4.05 },
    { f: 587.33, t0: 0.78, len: 3.85 },
  ];

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    let sample = 0;
    for (const n of notes) {
      if (t < n.t0) continue;
      const local = t - n.t0;
      const atk = 0.11;
      let env = 1;
      if (local < atk) env = (1 - Math.cos((local / atk) * Math.PI)) * 0.5;
      else
        env =
          Math.pow(1 - Math.min(1, (local - atk) / (n.len - atk)), 1.2) * Math.exp(-local * 0.22);
      const vib = 1 + 0.0032 * Math.sin(t * 4.1);
      const f = n.f * vib;
      sample +=
        env *
        0.13 *
        (Math.sin(2 * Math.PI * f * local) +
          0.14 * Math.sin(2 * Math.PI * f * 2 * local) +
          0.08 * Math.sin(2 * Math.PI * f * 3 * local) +
          0.04 * Math.sin(2 * Math.PI * f * 5 * local));
    }
    buffer[i] = Math.min(1, Math.max(-1, sample));
  }

  return buildWavFromBuffer(buffer, sampleRate);
}

/**
 * Çok düşük sesli, döngülü arka ped — önizleme kartında açıldıktan sonra atmosfer.
 */
export function createInviteAmbientPadBlobUrl(): string {
  const sampleRate = 44100;
  const durationSec = 14;
  const numFrames = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(numFrames);

  const fundamentals = [
    { f: 196.0, a: 0.045 },
    { f: 246.94, a: 0.038 },
    { f: 293.66, a: 0.032 },
  ];

  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    let s = 0;
    for (const b of fundamentals) {
      const lfo = 0.12 * Math.sin(t * 0.27 * 2 * Math.PI) + 0.08 * Math.sin(t * 0.09 * 2 * Math.PI);
      const f = b.f * (1 + lfo * 0.0025);
      s += b.a * Math.sin(2 * Math.PI * f * t) * (0.55 + 0.45 * Math.sin(t * 0.15));
    }
    const env = 0.2 + 0.8 * (0.5 - 0.5 * Math.cos((t / durationSec) * Math.PI));
    buffer[i] = s * env;
  }

  return buildWavFromBuffer(buffer, sampleRate);
}

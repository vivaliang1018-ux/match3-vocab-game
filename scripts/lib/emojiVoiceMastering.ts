/**
 * Shared mastering chain for short vocabulary recordings.
 *
 * Only leading/trailing silence is removed. Reversing the stream before the
 * second silenceremove pass prevents natural pauses inside a word or phrase
 * from being touched. Small safety margins keep consonant onsets and endings
 * intact even when the generated recording has a very quiet edge.
 */
export const EMOJI_VOICE_MASTER_FILTER = [
  'silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB:start_silence=0.06',
  'areverse',
  'silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB:start_silence=0.10',
  'areverse',
  'highpass=f=80',
  'lowpass=f=11000',
  // Tame isolated consonant/transient peaks so perceived loudness can be
  // normalized consistently without clipping or flattening the whole word.
  // A fast but soft-kneed attack catches very short consonant spikes; a slow
  // attack lets those spikes block loudness normalization on some recordings.
  'acompressor=threshold=-20dB:ratio=4:attack=0.1:release=80:knee=4',
  'loudnorm=I=-16:TP=-1.5:LRA=11',
].join(',');

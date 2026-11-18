"""Offline, unprompted ASR of existing vocabulary clips. Never changes audio."""
import argparse
import json
import unicodedata
import subprocess
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel

parser = argparse.ArgumentParser()
parser.add_argument('--sample', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
work = root / 'audio-work/gender-audit-2026-10-16'
rows = json.loads((work / 'manifest.json').read_text())
model = WhisperModel('tiny', device='cpu', compute_type='int8', cpu_threads=4, local_files_only=True)
normalize = lambda value: unicodedata.normalize('NFC', value).casefold()
files = {}
for locale in ['en', 'es', 'ja', 'ko']:
    directory = root / ('public/emoji-voice' if locale == 'en' else f'public/emoji-voice-{locale}')
    files[locale] = {normalize(p.stem): p for p in directory.glob('*.mp3')}
output = work / ('sample-transcripts.jsonl' if args.sample else 'transcripts.jsonl')
existing = {}
if output.exists():
    for line in output.read_text().splitlines():
        result = json.loads(line)
        existing[(result['id'], result['locale'])] = result
with output.open('a') as stream:
    for item in rows:
        if args.sample and item['id'] != 'guard':
            continue
        for locale in ['en', 'es', 'ja', 'ko']:
            key = (item['id'], locale)
            if key in existing and not existing[key].get('error'):
                continue
            expected = item['word'] if locale == 'en' else item['names'][locale]
            path = files[locale].get(normalize(expected))
            if path is None and (':' in expected or '：' in expected):
                variants = [expected.replace('：', ':'), expected.replace(':', '：'), ' '.join(expected.replace('：', ' ').replace(':', ' ').split())]
                path = next((files[locale].get(normalize(value)) for value in variants if files[locale].get(normalize(value))), None)
            result = {'id': item['id'], 'locale': locale, 'expected': expected, 'file': str(path) if path else None}
            if path:
                decoded = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], check=True, capture_output=True).stdout
                audio = np.frombuffer(decoded, dtype=np.float32)
                segments, info = model.transcribe(audio, language=locale, beam_size=5, temperature=0, condition_on_previous_text=False, vad_filter=False)
                segments = list(segments)
                result.update(transcript=' '.join(s.text.strip() for s in segments), duration=info.duration,
                              avg_logprob=sum(s.avg_logprob for s in segments) / max(1, len(segments)))
            else:
                result['error'] = 'No exact NFC/case-insensitive filename; inspect runtime fallback before drawing a content conclusion.'
            stream.write(json.dumps(result, ensure_ascii=False) + '\n')
            stream.flush()
            print(json.dumps(result, ensure_ascii=False), flush=True)

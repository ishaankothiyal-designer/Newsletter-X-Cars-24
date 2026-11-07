"""Prepare a gentle paper turn from planish/John Rose's public-domain recording.
Source: https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg
"""
from pathlib import Path
import math, wave, struct, subprocess, tempfile
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as tmp:
 edit=Path(tmp)/'paper.wav'
 subprocess.run(['ffmpeg','-v','error','-y','-ss','1.44','-t','0.84','-i',str(root/'source-assets/audio/turning-a-page.ogg'),'-af','atempo=2.4,highpass=f=180,lowpass=f=2400,afade=t=in:st=0:d=0.025,afade=t=out:st=0.28:d=0.07','-ac','1','-ar','44100','-c:a','pcm_s16le',str(edit)],check=True)
 with wave.open(str(edit),'rb') as f:
  rate=f.getframerate();raw=f.readframes(f.getnframes())
 samples=[v[0]/32768 for v in struct.iter_unpack('<h',raw)]
 rms=math.sqrt(sum(v*v for v in samples)/len(samples));peak=max(map(abs,samples))
 scale=min(.035/rms,.22/peak);samples=[v*scale for v in samples]
 for folder in [root/'dist/assets',root/'dist/versions/v8/assets']:
  with wave.open(str(folder/'page-turn-soft.wav'),'wb') as out:
   out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate)
   out.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
 print('Soft paper turn: %.0fms, peak %.3f, RMS %.3f' % (len(samples)/rate*1000,max(map(abs,samples)),math.sqrt(sum(v*v for v in samples)/len(samples))))

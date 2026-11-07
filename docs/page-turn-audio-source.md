# Soft page-turn audio provenance

Source: https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg
Original recording: “turning a page”, planish / John Rose, 5 July 2007, PDSounds record 304.
The source page states that the author released this recording into the public domain worldwide and permits use for any purpose.

The unmodified source is retained at `source-assets/audio/turning-a-page.ogg`. The production derivative is `dist/assets/page-turn-soft.wav`, mirrored under the saved V8 assets. `scripts/create-page-sound.py` reproduces it with ffmpeg: select 1.44–2.28 seconds, shorten the movement with atempo 2.4, filter below 180 Hz and above 2400 Hz, and apply soft fades. Master to RMS <= 0.035 and peak <= 0.22; no impact or synthetic flutter is added. Runtime playback preserves pitch and follows the card departure duration.

The older procedural `page-turn.wav` remains an unused historical asset. It is no longer referenced by the audio controller.

# Chess Sound Files

This directory contains sound effects for the chess game.

## Required Files

Place the following MP3 files in this directory:

- `move.mp3` - Subtle wood click/piece movement sound (~20KB)
- `capture.mp3` - Slightly sharper sound for captures (~25KB)
- `check.mp3` - Alert tone for check (~30KB)
- `checkmate.mp3` - Victory/defeat chord for checkmate (~35KB)
- `ambient.mp3` - (Optional) Soft looping background music (~200KB)

## Where to Get Sounds

### Free Sound Libraries:
1. **Freesound.org** - https://freesound.org
   - Search for: "chess piece", "wood click", "game move"
   - Filter by: CC0 (public domain)

2. **Zapsplat.com** - https://www.zapsplat.com
   - Free account required
   - Search: "board game", "chess", "wooden piece"

3. **Pixabay** - https://pixabay.com/sound-effects
   - Search: "click", "wood", "game"

### AI-Generated (Quick Option):
Use ElevenLabs or similar AI sound generators to create custom sounds quickly.

### Placeholder for Development:
If you don't have sounds yet, the app will continue to work - it just won't play sounds. The sound service gracefully handles missing files.

## Sound Specifications

- **Format**: MP3 (best mobile compatibility)
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps or higher
- **Duration**: 0.1-0.5 seconds (except ambient)
- **Volume**: Normalized to -6dB to -3dB peak

## Testing

After adding sounds:
1. Run `npm run dev`
2. Open in browser
3. Click board to initialize sound system (iOS requirement)
4. Make moves to test each sound
5. Test on mobile devices (iOS Safari, Android Chrome)

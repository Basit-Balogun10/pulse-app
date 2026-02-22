# Pulse Demo Automation

Automated demo runner for the Pulse health app that strictly follows `demo-script.md`.

## Quick Start

### Option 1: URL Parameter (Recommended)

```bash
# Start the development server
pnpm dev

# Open in browser with auto-start parameter
http://localhost:3000?demo=auto
```

### Option 2: Keyboard Shortcut

1. Start the app: `pnpm dev`
2. Open <http://localhost:3000>
3. Press **Ctrl+Shift+D** (Windows/Linux) or **Cmd+Shift+D** (Mac)

## Recording the Demo

1. **Start your screen recording software** (OBS, QuickTime, etc.)
2. **Open the app** with `?demo=auto` parameter
3. **The demo will auto-play** through all 14 scenes (~10 minutes)
4. **Stop recording** when complete

### Recording Settings (Recommended)

- **Resolution**: 390x844 (iPhone 12 Pro) or 1920x1080 (with mobile viewport)
- **Frame Rate**: 30fps minimum
- **Format**: MP4 or MOV
- **Audio**: Optional (demo is silent)

## Demo Flow (14 Scenes)

The runner executes strictly according to `demo-script.md`:

1. **Scene 1**: Onboarding (~20s) - Amara's pre-filled profile
2. **Scene 2**: Home Screen (~45s) - 15-day streak and history
3. **Scene 3**: Today's Check-in (~60s) - Day 15 critical data entry
4. **Scene 4**: AI Analysis (~60s) - Pattern detection and recommendation
5. **Scene 5**: Detailed Analysis (~60s) - AI reasoning with citations
6. **Scene 6**: Clinic Booking (~60s) - Filtered search and scheduling
7. **Scene 7**: Feedback Loop (~45s) - User follow-up system
8. **Scene 8**: Auto-booking (~45s) - 100% free appointment
9. **Scene 9**: Chat with Context (~60s) - AI knows full history
10. **Scene 10**: Profile (~30s) - Health metrics and streak
11. **Scene 11**: Billing (~30s) - Tier-based discounts
12. **Scene 12**: Clinic Dashboard (~60s) - Partner portal view
13. **Scene 13**: Analytics (~variable) - Visual health trends
14. **Scene 14**: Summary - Complete journey wrap-up

**Total Duration**: ~10 minutes

## Logging and Debugging

All actions are extensively logged to the browser console for debugging and traceability.

### View Logs in Real-Time

Open **Browser DevTools** (F12) → **Console** tab to see:

```
[HH:MM:SS] 🎬 Demo Runner initialized
[HH:MM:SS] ═══════════════════════════════════════
[HH:MM:SS] 📋 SCENE 1: User Onboarding [~20s]
[HH:MM:SS] ═══════════════════════════════════════
[HH:MM:SS] Story: Amara, 28F, family history...
[HH:MM:SS] ✓ Onboarding screen detected
...
```

### Download Logs

After demo completes, run in console:

```javascript
getDemoRunner()?.exportLogs()
```

Or download as text file:

```javascript
// In React component (if you add the UI)
downloadLogs()
```

## Troubleshooting

### Demo doesn't start

- **Check console** for errors
- **Verify URL parameter**: Must be `?demo=auto` (not `?demo=true`)
- **Try keyboard shortcut**: Ctrl+Shift+D

### Demo gets stuck on a scene

- **Check console logs** to see which scene failed
- **Look for error messages** in red
- **Missing components**: Some scenes may need UI components implemented

### Elements not found

The runner uses flexible selectors but may need adjustment if UI structure changes. Check:

- Button text matches expected values
- Data attributes are present (`data-testid`, `data-tab`, etc.)
- Navigation structure is correct

## Manual Control (For Testing)

### Start demo programmatically

```javascript
// In browser console
import { getDemoRunner } from '@/lib/demo-runner';
const runner = getDemoRunner();
await runner.runDemo();
```

### Run specific scene

```javascript
// In browser console (after modifying demo-runner.ts)
const runner = getDemoRunner();
await runner['scene3_TodaysCheckIn'](); // Private method access for testing
```

## Demo Data

The demo uses mock data from `lib/mock-data.ts`:

- **Amara's 15-day health history** (Day 1-15)
- **Progressive health decline pattern**
- **Family medical history**
- **Mock clinics** with partnerships

All data strictly follows the story in `demo-script.md`.

## Features

✅ **Completely invisible** - No UI elements during demo  
✅ **Extensive logging** - Every action logged with timestamp  
✅ **Follows demo script** - Strict adherence to demo-script.md  
✅ **Auto-navigation** - Moves through all 14 scenes automatically  
✅ **Detailed explanations** - Logs explain what's happening and why  
✅ **Error handling** - Continues even if elements not found  
✅ **Flexible triggers** - URL param or keyboard shortcut  

## Production Notes

**IMPORTANT**: Remove or disable demo runner before production deployment!

To disable:

1. Remove `<DemoRunnerProvider />` from `app/layout.tsx`
2. Or add environment check:

```typescript
{process.env.NODE_ENV === 'development' && <DemoRunnerProvider />}
```

## Support

If you encounter issues:

1. Check browser console for detailed logs
2. Verify all UI components are implemented
3. Ensure demo-script.md matches current implementation
4. Test manually first to ensure app works correctly

---

**Happy demoing! 🎬**

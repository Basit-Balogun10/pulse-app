# 🎬 Pulse Demo - Quick Start Card

## To Record Demo Video:

### 1. Start Server
```bash
pnpm dev
```

### 2. Open Browser with Auto-Demo
```
http://localhost:3000?demo=auto
```
**OR** press `Ctrl+Shift+D` after opening http://localhost:3000

### 3. Start Recording
- Demo auto-plays through all 14 scenes (~10 minutes)
- All actions logged to console (F12)
- Completely invisible - no UI interference

---

## Recording Settings

- **Window Size**: 390x844 (iPhone 12 Pro)
- **Frame Rate**: 30fps
- **Format**: MP4
- **Duration**: ~10 minutes

---

## What Gets Automated

✅ Scene 1: Onboarding (Amara's profile)  
✅ Scene 2: Home (15-day streak)  
✅ Scene 3: Check-in (Day 15 critical data)  
✅ Scene 4: AI Analysis (pattern detection)  
✅ Scene 5: Detailed Analysis (citations)  
✅ Scene 6: Clinic Booking (filtered search)  
✅ Scene 7: Feedback Loop (follow-up)  
✅ Scene 8: Auto-booking (100% free)  
✅ Scene 9: Chat (with context)  
✅ Scene 10: Profile (metrics)  
✅ Scene 11: Billing (tiers)  
✅ Scene 12: Clinic Dashboard (partner view)  
✅ Scene 13: Analytics (trends)  
✅ Scene 14: Summary (wrap-up)  

---

## Logs

Open Console (F12) to see detailed logs:
```
[14:23:15] 🎬 Demo Runner initialized
[14:23:17] 📋 SCENE 1: User Onboarding [~20s]
[14:23:17] ✓ Onboarding screen detected
...
```

Export logs: `getDemoRunner()?.exportLogs()`

---

## Troubleshooting

**Demo doesn't start?**
- Check URL is `?demo=auto` exactly
- Try Ctrl+Shift+D instead
- Check console for errors

**Gets stuck?**
- Runner continues automatically after timeout
- Check console for warnings
- Some UI components may need implementation

---

**Full docs**: See `DEMO_AUTOMATION.md` and `DEMO_COMPLETE.md`

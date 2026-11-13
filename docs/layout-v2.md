# Layout Engine v2
## Observed on-device
At width factor 1.55, text was tightly overlapping. At 2.3, text became readable but characters still touched; font size was acceptable. These observations motivate the default, not a claim of exact calibration.
## Behavior
- Default width factor 2.3; independent letter-spacing multiplier 1.25.
- Font size remains unchanged unless total calculated advance exceeds 88% of 3840px scene width.
- Per-character measured advances with a minimum width for Hangul, kana and CJK; spaces occupy width but do not generate layers.
- Settings saved locally under `motionweaver.layout.v2` and restored on reload.
- XML compiler unchanged from v1 to avoid changing the known importable XML structure.
## Manual checks (not yet executed on Alight Motion)
1. Compare 'sibal!!!' and '감자새는 귀엽다' at factor 2.3 and spacing multiplier 1.25.
2. Raise spacing multiplier to 1.5 while holding font size fixed; compare spacing and center.
3. Reload and check settings persistence.
4. Test 50 W characters and a long Korean sentence for fit-to-width.
5. Verify XML imports and each non-space character remains editable.
## Limits
The preview still uses browser Arial, whereas the XML uses Source Sans Pro 900; device-level font anchoring and rendering are not established. The language-specific minimum advance is a heuristic, not calibrated per language.

## v2.1 cross-device correction
- Removed `CanvasRenderingContext2D.measureText()` from layout calculations. OS font fallback no longer changes generated glyph x coordinates.
- Stable per-character em advances are deterministic approximations; calibration remains possible via width factor and spacing multiplier.
- The preview requests web fonts Source Sans 3 and Noto Sans KR, with local fallbacks if unavailable. Source Sans 3 is not identical to XML's Source Sans Pro; therefore rendered glyph appearance may still differ.
- The first five x coordinates are shown in a diagnostics line. On PC and mobile, use identical text and settings; the displayed coordinates should match even if rendered glyph outlines differ.
- A locally saved v2 calibration can differ between devices. Compare input settings before concluding the coordinate engine differs.
- This update is committed to the existing v2 PR and has not yet been verified through Alight Motion import.

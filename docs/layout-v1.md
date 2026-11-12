# Layout Engine v1 — screenshot / XML regression
Observed import: `sibal!!!` generated 9 text layers, with 210px text, fixed 630px wrap boxes, and adjacent X deltas of ~88–145px. The screenshot showed major overlap even though the layers and keyframes imported successfully.

## Changes
- Use conservative per-character advance slots (Canvas Arial width × adjustable safety factor, default 1.55).
- Auto-fit long strings into 88% of 3840px width; center the entire row.
- Skip XML layers for spaces but preserve their spacing.
- Set each text layer's wrapWidth based on its estimated glyph slot rather than 630px for all letters.
- Provide user-facing safety-factor and X-anchor calibration controls.
- Use one shared layout model for preview and XML; separate layout and compiler modules.

## Caveats
Alight Motion's text anchoring and actual Source Sans Pro 900 glyph metrics are not established by the screenshot. The fix is a testable hypothesis, not a confirmed device fix. Please test `sibal!!!`, `POP!`, `WWWiii`, `안녕하세요`, `こんにちは` and report screenshots or exported XML.

## Manual regression
1. Load GitHub Pages, generate `sibal!!!`, import in Alight Motion.
2. At settled keyframe, verify spacing and overall centering.
3. If letters overlap, increase safety factor (e.g. 1.8, 2.2); if off-center adjust X anchor.
4. Repeat for Latin, Korean, Japanese, spaces and long text.
5. Verify all layers remain independently editable.

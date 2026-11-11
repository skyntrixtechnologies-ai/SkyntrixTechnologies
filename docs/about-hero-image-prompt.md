# About Us hero background — AI image generator prompt

Use with Midjourney, DALL·E 3, or Stable Diffusion to generate the final
artwork for the About Us page hero (`client/src/pages/About.jsx`). Once
generated, drop the file into `client/src/assets/` and swap it in for
`<HeroCinematicArt />` (or layer both — see note at the bottom).

## Main prompt

```
Premium cinematic 3D background for a modern software development and
digital innovation company's About Us hero section. Concept: "The Digital
Universe of Innovation."

A large abstract 3D glass sculpture positioned on the right side of the
frame — faceted, translucent, catching light like cut crystal. Around it,
floating translucent geometric objects of varying sizes drift in space.
Elegant interconnected orbital rings encircle the sculpture at different
angles. Glowing purple and electric blue energy trails sweep through the
scene like light streaks. A scattering of subtle, soft-focus digital
particles fills the depth of field. Materials are sophisticated glass and
brushed metal, with realistic refraction, soft caustics and specular
highlights.

Color palette: deep black-purple background, royal violet, electric blue.
Primary purple #7200F5, primary blue #2048F5, near-black purple
#0A0612 in the shadows.

Composition: ultra-wide 16:9 landscape, cinematic framing. The LEFT 45% of
the frame is completely dark, clean, and empty — no shapes, no glow, no
particles — reserved for white heading and breadcrumb text to sit on top
in post. The RIGHT 55% contains all the 3D artwork, balanced and
centered within that zone, with a soft falloff so it doesn't hard-edge
against the dark left side.

Style: photorealistic, Unreal Engine 5 quality, ray-traced lighting,
luxury technology branding aesthetic, cinematic three-point lighting with
a key light from the upper right, elegant, minimal, futuristic, high-end
product-render quality, shallow depth of field on background particles,
8k detail.

No text, no typography, no logos, no watermark, no people, no hands, no UI
elements.
```

## Negative prompt (Stable Diffusion / anything that accepts one)

```
text, typography, letters, words, logo, watermark, signature, people,
hands, faces, UI, icons, busy left side, clutter on left half, low detail,
flat lighting, cartoon, illustration, 2D, blurry, oversaturated, noise
```

## Settings that help

- Aspect ratio: `--ar 16:9` (Midjourney) or 1920×1080 / 2560×1440 canvas.
- Midjourney extras: `--style raw --v 6.1 --stylize 250`
- If the model keeps filling the left side, generate the full scene normally,
  then regenerate just the left 45% as a solid `#0A0612` → transparent
  gradient in an image editor and composite it over the export — this
  guarantees text contrast regardless of what the model draws.

## Using it alongside the current code-based background

`client/src/components/HeroCinematicArt.jsx` is a CSS/SVG stand-in built
from the same brief, already wired into the About page hero. It's quick,
responsive and needs no asset — fine to ship as-is, or swap for the
generated image via `background-image` once you have a final render you're
happy with. The component's left-side gradient overlay (the last `<div>`
in the file) is written defensively — keep an equivalent overlay if you
switch to a photo/render, since no generator will perfectly guarantee a
clean left 45% on every attempt.

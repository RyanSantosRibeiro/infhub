# Prompts das imagens FRAME

Geradas em 25/09/2026 com a ferramenta built-in `image_gen.imagegen`, usando a skill `imagegen`. Não foi usado fallback CLI/API. Os três arquivos foram inspecionados visualmente: imagens em paisagem, sem pessoas, sem elementos de interface ou marcas d'água. Os originais gerados foram preservados.

## Mídia otimizada para a página

As versões WebP foram convertidas dos PNGs por Sharp, com qualidade 82 e esforço 6, mantendo a resolução de 1672 × 941:

- `public/images/hero-neon.webp`: 139.766 bytes.
- `public/images/cozy-room.webp`: 248.004 bytes.
- `public/images/cosmic-landscape.webp`: 200.646 bytes.

O vídeo `public/videos/overlay-showcase.mp4` foi composto com FFmpeg 7.1 a partir das três imagens originais, sem alterar os PNGs. Formato H.264, 960 × 540, 24 fps, 15 segundos, sem áudio, 1.149.640 bytes, com `faststart`. Cada cenário é apresentado em sequência, com dissolvências de 1 segundo. O final retorna ao cenário inicial para um loop contínuo. Validado por metadados e inspeção de um contato com quatro quadros extraídos.

FFmpeg foi obtido pelo pacote temporário `imageio-ffmpeg` 0.6.0 em `.next/media-tools`, diretório ignorado pelo Git. Não há nova dependência de produção nem alteração no `package.json`.

## hero-neon.png

Arquivo: `public/images/hero-neon.png`.

```text
Use case: stylized-concept.
Asset type: cinematic landscape background for a premium streamer OBS overlay collection, landscape 16:9.
Primary request: a dark otherworldly cyberpunk landscape with sharp violet mountain silhouettes on the horizon, a monumental glowing lime-green circular portal standing on black stone in the middle distance, and a softly lit planet in the night sky.
Style/medium: polished cinematic science-fiction concept art, atmospheric 3D realism, exquisite textures, restrained glow and high contrast.
Composition/framing: broad panoramic vista, portal slightly right of center; dark foreground with a glassy reflective surface; mountains in layered silhouettes; a lot of dark breathable sky.
Lighting/mood: deep nocturnal violet atmosphere, vivid acid-lime portal provides luminous rim-light and a subtle reflection on the ground.
Color palette: almost black, ink purple, violet, restrained electric lime green.
Constraints: landscape composition, no people, no text, no letters, no logos, no interface, no overlay frames, no watermark; render only the environment image.
```

## cozy-room.png

Arquivo: `public/images/cozy-room.png`.

```text
Use case: stylized-concept.
Asset type: full-bleed background art for a cozy streamer OBS overlay preview, landscape 16:9.
Primary request: a cozy anime-inspired lo-fi bedroom at night, pastel rose and lavender atmosphere, a large window looking out into a quiet lush moonlit garden.
Style/medium: refined hand-painted anime background art, finely detailed, cinematic gentle composition, tactile furnishings.
Composition/framing: wide comfortable room with a desk and softly glowing lamp, a low bed with soft blankets, plants, pillows; large window and tranquil garden view are central focal points; no people.
Lighting/mood: peach-pink desk light and pale lavender moonlight, warm and serene, subtle rosy ambient glow, calm nighttime mood.
Color palette: dusty pink, mauve, lavender, warm cream, dark garden greens.
Constraints: landscape composition, no people, no text, no letters, no logos, no interface, no overlay frames, no watermark; render only the environment image.
```

## cosmic-landscape.png

Arquivo: `public/images/cosmic-landscape.png`.

```text
Use case: stylized-concept.
Asset type: cinematic full-bleed sci-fi landscape background for a streamer OBS overlay preview, landscape 16:9.
Primary request: a fantastical alien landscape at night, jagged dark rocks and an ethereal aqua glowing river winding toward the horizon, a huge elegant planet hanging low in an immense dark cosmic sky.
Style/medium: premium cinematic science-fiction concept art, highly polished atmospheric 3D realism, detailed organic alien geology.
Composition/framing: expansive wide vista, dark rock formations at the edges frame the winding aqua river, planet in the upper middle of the scene, layered silhouettes provide depth.
Lighting/mood: mysterious, beautiful and immersive, luminous cyan water softly illuminates surrounding rocks, a delicate nebula glows behind the planet.
Color palette: near-black midnight blue, deep teal, aqua and cyan, restrained purple accents.
Constraints: landscape composition, no people, no text, no letters, no logos, no interface, no overlay frames, no watermark; render only the environment image.
```

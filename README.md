# Solar System Simulation

An interactive model of the solar system. Planet and moon positions come from
real orbital elements rather than decorative circles, and the simulation can be
driven from real time out to a century a second, forwards or backwards.

It also carries NASA's solar and lunar eclipse catalogues for 2001–2100. Picking
an event moves the simulation to the moment of greatest eclipse, points the
camera at Earth and slows the clock down enough to watch it happen.

Earth is drawn with a custom shader: day and night sides, city lights on the
dark half, cloud layer, an atmospheric rim, ocean specular from moonlight, and a
surface that changes with the season.

<img width="1874" height="1036" alt="image" src="https://github.com/user-attachments/assets/a85c6d99-3b60-4065-a406-6abd920cc11c" />

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production
npm run lint                 # eslint
```

## Controls

| Key | Action |
| --- | --- |
| `space` | play / pause |
| `←` `→` | time rate down / up |
| `r` | reverse direction |
| `n` | jump to now |
| `l` | toggle body labels |
| `o` | toggle orbit paths |

Drag to orbit the camera, scroll to zoom.

## Project structure

```
src/
  app/                    layout, design tokens, vendored fonts
  components/
    solar-system-page.tsx top-level state and layout
    solar-system-scene.tsx the render loop
    scene-labels.tsx      screen-space labels
    earth/                Earth shaders and material
    sun/                  Sun glow and the system's light
    ui/                   control rail, time bar, eclipse browser
  utils/
    astronomy-engine.ts   orbital elements and ephemerides
    eclipse-data.ts       NASA catalogue parsing
    simulation-clock.ts   the time source
    seasonal-albedo.ts    monthly surface textures
    time.ts               rate presets and formatting
scripts/
  optimize-textures.py    regenerates public/textures from the raw sources
```

## Data sources

- Eclipse catalogues: NASA GSFC, Fred Espenak
- Surface imagery: NASA Visible Earth, Blue Marble Next Generation

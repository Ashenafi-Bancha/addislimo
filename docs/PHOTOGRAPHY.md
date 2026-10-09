# Photographing the fleet

The site now carries real photography rather than a 3D model. This is how to
shoot cars that look like the references we were aiming at, with a phone and
no studio, and how to get them onto the site yourself.

## Why this beats 3D here

A customer booking a chauffeur wants to see the car that will collect them.
A photograph of your actual vehicle, with your plate and your driver, proves
the service exists. A 3D model proves nothing, costs every visitor several
hundred kilobytes, and would need a licensed model to look convincing.

## The shoot

**When.** Blue hour: the 20 to 30 minutes after sunset. The sky still carries
light, the city lights are on, and car paint stops showing harsh reflections.
Addis sits near the equator, so this window is short and arrives fast; be set
up before the sun goes down. Overcast midday is the fallback.

**Where.** Somewhere with a clean, dark, uncluttered background:

- A hotel forecourt after the rush, with the building lit behind.
- An empty upper floor of a parking structure.
- Any wide road with the Bole or Kazanchis skyline behind the car.

Avoid bins, cables, parked cars, and people in the frame.

**Washing matters more than the camera.** A dirty car reads as a cheap
service in every photograph. Wash and dry it, including the wheels, and wipe
the glass last.

**Angles to capture, per vehicle:**

1. **Front three-quarter**, camera low, about a metre off the ground. This is
   the hero shot and the one the references use.
2. **Side profile**, square on, for the fleet cards.
3. **Rear three-quarter**, to show the back of the car.
4. **Interior**: rear seats from the open door, clean and empty.
5. **One with the chauffeur**, standing by the open rear door, uniformed.
   This is the single most persuasive image a chauffeur service can own.

**Technique:**

- Shoot in landscape for the hero, portrait only for phone-first sections.
- Tap the car body to set exposure, then pull the brightness down slightly.
  A slightly dark photo looks expensive; a blown-out one looks amateur.
- Keep the phone level. A tilted car looks like a snapshot.
- Turn the car's lights on. Lit headlamps and tail lamps carry the image.
- Take far more than you need, from slightly different heights.

## Getting them on the site

Photographs are content, so you change them yourself, no developer needed:

1. Open the admin at `/admin`, sign in.
2. **Website Content**.
3. For the home page banner, open **Hero** and replace the photograph.
   Landscape, roughly 16:9. Phones show the whole picture, so keep the car
   away from the extreme edges.
4. For the vehicle cards, open **Fleet** and replace each photograph.
5. For the Airport page banner, open **Airport Transfer**.
6. Press **Save**, then **Export** and send the file to your developer to
   publish, until the backend stores content directly.

## Before uploading

Large photos are slow on mobile data, which is how most of your customers
will arrive. The admin resizes uploads automatically, but starting smaller is
better:

```bash
pnpm --filter @addislimo/frontend exec gltf-transform --help
```

For images, any of these work:

- The admin's own upload, which scales to 1600px and re-encodes.
- Windows Photos: Resize, Large, then save.
- Squoosh (squoosh.app) in a browser, exporting WebP at about 80 quality.

Aim for under 300 KB per photograph. The current hero is 205 KB.

## What we keep from the 3D work

Nothing is lost if you change your mind. The scene, the studio lighting and
the Blender pipeline are parked, not deleted: see `docs/3D-WORKFLOW.md`.

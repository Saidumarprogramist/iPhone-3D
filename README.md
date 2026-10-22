# AURA ONE — Beyond the ordinary

An independent, fictional smartphone design study. A scroll-directed 3D product story built with React, Vite, React Three Fiber, Three.js, GSAP and Tailwind. Not affiliated with Apple; no real device specifications, orders or payments.

## Experience

- One persistent 3D canvas, procedural rounded titanium body, reflective triple-lens camera, USB-C port, side buttons and a generated screen wallpaper.
- Art-directed desktop and mobile compositions across design, engineering, camera and finish studio chapters.
- Four live finishes; pointer dragging, keyboard-accessible rotation buttons and pause control.
- Native modal film player using the bundled video; configuration summary reflecting the selected finish.
- Reduced-motion support, keyboard focus restoration, skip navigation and a CSS device if WebGL fails.
- No external fonts, HDR downloads or wallpaper image requests. 3D loads separately from page content.

## Run

Node.js 22 recommended.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment

The production branch is `premium-iphone-3d-experience-abf00`.

GitHub repository **Settings → Pages → Build and deployment → Source: GitHub Actions** is required. If the `github-pages` environment has a branch policy, allow the production branch there as well.

Pushing the production branch builds, lints and deploys `dist/` to GitHub Pages. Pull requests and `main` are checked without publishing over production. A manual workflow run is also available. The relative production base supports the `/iPhone-3D/` project path. Use the URL reported by the deployment job.

Vercel is a separate hosting configuration: set its production branch to the same branch, framework to Vite, build to `npm run build` and output to `dist`. Changing GitHub's default branch alone does not change Vercel's production branch.

## Interaction checks

1. Explore each navigation link and verify the device composition changes with the chapter.
2. Select all finishes, rotate by dragging and with the arrow buttons, then pause/resume.
3. Play/close the film; Escape closes dialogs and focus returns to the trigger.
4. Open the configuration summary and verify the selected finish.
5. Test at 390px and 1440px widths, reduced motion and a browser without WebGL.

The displayed hardware numbers are concept design labels, not verified commercial specifications. The bundled film is a visual reference from the original repository, not a rendering of the procedural AURA ONE model.

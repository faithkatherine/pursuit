# Pursuit Public Website Implementation Notes

## Chosen structure

The public Pursuit website lives in `docs/design` as a small standalone Next.js App Router project. This keeps the marketing/showcase site separate from the existing Expo mobile app while preserving the current design artifacts in the same folder.

## Deployment

There is no existing Vercel configuration in the repository. The root `package.json` is configured for Expo, so Vercel should use `docs/design` as the project root for this public website. From that folder, Vercel can detect Next.js and run:

- Install: `npm install`
- Build: `npm run build`

## Existing design files

The existing HTML design references are kept in place and linked from the website:

- `Pursuit Home.html`
- `Pursuit Web Designs.html`
- `Pursuit Web Playbook.html`
- `Pursuit Buttons.html`

## Scope

This is a static, public-facing Next.js showcase site. It does not implement backend integrations, auth, ticketing, payments, organizer workflows, or mobile app functionality.

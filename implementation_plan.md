# Implementation Plan: Add "I'm New Here" Page

We will create a premium, state-of-the-art "I'm New Here" page (`/new-here`) matching the clean light theme preference (black text, light background) and modern responsive components.

## Proposed Changes

### 1. "I'm New Here" Page

#### [NEW] [page.tsx](file:///c:/Users/HomePC/projects/rol/app/(public)/new-here/page.tsx)
- Create a client component containing the following elements:
  - **Hero Header**: Welcome message with smooth fade-in animations using `framer-motion`.
  - **Pastor's Welcome**: A clean card highlighting a letter from the Lead Pastor, designed with premium spacing.
  - **What to Expect Grid**:
    - *Worship rhythm*: Times of Sunday worship and Wednesday bible study.
    - *What to wear*: Encouraging "come as you are" message.
    - *Where to go*: Navigating the entrance, lobby, and auditorium.
    - *Kids & Youth*: Details on children's church safety and teaching.
  - **Digital Connect Card**: An interactive form for newcomers to share their contact information, selection of interest area (e.g., house fellowship, baptism, volunteering), and any prayer requests.
  - **Animated Confirmation**: A beautiful success state with a checkbox animation upon submitting the form.

### 2. Connect the Hero CTA

#### [MODIFY] [HeroSection.tsx](file:///c:/Users/HomePC/projects/rol/components/sections/HeroSection.tsx)
- Modify the "New here ?" button click behavior. Instead of scrolling down to the local `#about` section, it will navigate to the `/new-here` page so visitors can immediately access the comprehensive welcome hub.
- Update the button layout from a `<button>` to a `<Link>` or navigate using Next.js `useRouter`.

### 3. Update Navbar

#### [MODIFY] [Navbar.tsx](file:///c:/Users/HomePC/projects/rol/components/Navbar.tsx)
- Optionally add "New Here" link to the nav menu list to make it easily accessible.

---

## Verification Plan

### Automated/Compilation Checks
- Run `npm run build` to verify Next.js static page generation for `/new-here`.

### Manual Verification
- Navigate to `/` and click the "New here ?" button. Confirm it redirects to `/new-here`.
- Verify the layout looks clean on both desktop and mobile viewports.
- Fill out and submit the "Digital Connect Card" form and verify that the success state displays correctly.

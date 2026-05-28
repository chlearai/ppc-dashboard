# Homepage with Login

## Goal
Create a public-facing homepage that introduces AI PPC Operator clearly, keeps the tone restrained and enterprise-grade, and makes login the main action.

## Design Direction

Use a split-screen layout:

- Left side: product story, proof points, and a compact preview of the workspace.
- Right side: the actual login form, visually dominant and easy to scan.

The homepage should feel like a serious SaaS entry point, not a marketing landing page or a decorative brand hero.

## Content Hierarchy

1. Brand mark and product name.
2. Literal headline describing the product.
3. Supporting paragraph focused on the operating model: AI asks first, recommendations carry evidence, approvals gate execution, plans remain versioned.
4. Compact proof points for the core surfaces: Ask, Act, Architect, Intelligence.
5. Login form with email, password, and sign-in button as the primary action.
6. Optional workspace credential hint for the existing internal demo flow.

## Visual System

- Restraint-first enterprise palette.
- Warm neutral canvas, dark ink text, teal primary action.
- Semantic amber and red only for risk and waste states.
- No decorative gradients, blobs, or oversized illustrations.
- Tight spacing, fixed hierarchy, and minimal motion.

## Layout Rules

- The left panel should read as a product brief with evidence, not brochure copy.
- The right panel should feel like a secure sign-in surface.
- Keep the login action above the fold on typical laptop and desktop sizes.
- Avoid nested cards and avoid hero clichés like oversized number tiles.

## Homepage Copy

Headline direction:

- AI PPC Operator for serious campaign planning

Supporting message:

- AI asks before it plans.
- Every recommendation carries logic, source, confidence, and risk.
- Write actions go through approval.
- Campaign books stay versioned and auditable.

Proof points:

- Google Ads and Meta Ads
- Ask, Act, Architect
- Versioned campaign books
- Approval-safe execution

## Implementation Notes

- Reuse the existing login flow and backend auth behavior.
- Keep the page compatible with the current workspace session model.
- Preserve the current sign-in form behavior and error handling.
- Add only the homepage structure and presentation needed for the new entry point.

## Verification

- Confirm the page renders cleanly at desktop and mobile widths.
- Confirm the login form remains the main action.
- Confirm no overflow, clipping, or overlapping text.
- Run build, lint, and browser checks after implementation.

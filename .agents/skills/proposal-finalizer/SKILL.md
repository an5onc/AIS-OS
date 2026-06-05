---
name: proposal-finalizer
description: Finalize a NexGen Studio proposal Markdown file into a branded PDF with pricing, service area, NexGen branding, and visual QA checks.
---

# /proposal-finalizer

You are turning a proposal draft into a client-ready NexGen Studio PDF. This is the handoff after `/proposal-builder`, not a replacement for it.

## Pre-flight

Ask only for missing final values:

1. Proposal Markdown path, defaulting to the newest file in `proposals/*.md`.
2. Final price or pricing option to show.
3. Final service area, if the draft still says "Service area to be confirmed."
4. Any client-specific contact details that should be inserted before finalizing.

If Anson says to leave pricing as a placeholder, proceed and keep the placeholder visible.

## Context to read

- `references/nexgen-brand.md`
- `references/nexgen-pricing.md`
- The proposal Markdown file being finalized.
- `scripts/render_proposal_pdf.py`

## Process

1. Open the proposal Markdown and scan for placeholders:
   - `[Anson to confirm final price]`
   - `Service area to be confirmed`
   - missing phone/email/social links
   - missing logo/photos/client assets
2. If values are available, update the Markdown draft first so the source stays truthful.
3. Run the renderer:

   ```sh
   python3 scripts/render_proposal_pdf.py proposals/<client>.md --out proposals/<client>-branded.pdf --price "<price>" --service-area "<service area>"
   ```

4. Verify required text is present:

   ```sh
   python3 - <<'PY'
   from pypdf import PdfReader
   p = "proposals/<client>-branded.pdf"
   r = PdfReader(p)
   text = "\n".join((page.extract_text() or "") for page in r.pages)
   for needle in ["Prepared by NexGen Studio", "Investment", "Next Steps"]:
       assert needle in text, needle
   print("pages", len(r.pages))
   print("required strings ok")
   PY
   ```

5. Render cover and at least one inner page with Quick Look if available:

   ```sh
   qlmanage -t -s 1000 -o /tmp/nexgen-proposal-preview proposals/<client>-branded.pdf
   ```

6. Visually inspect the preview. Check:
   - no logo rectangle artifacts
   - inner-page header logo has top padding
   - cover text is readable
   - tables do not clip
   - no obvious overlap

7. Report the final PDF path and any remaining placeholders.

## Rules

- Do not send the PDF automatically.
- Do not hide missing price or missing client details. Surface them.
- Do not invent pricing. Use `references/nexgen-pricing.md` or ask Anson.
- If render verification fails, fix the PDF before reporting it ready.
- If Quick Look is unavailable, still run the text verification and state that visual preview could not be rendered.

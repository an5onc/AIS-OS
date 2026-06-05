import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "render_proposal_pdf.py"


def load_module():
    spec = importlib.util.spec_from_file_location("render_proposal_pdf", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class RenderProposalPdfTests(unittest.TestCase):
    def test_slugify_removes_punctuation_and_lowercases(self):
        module = load_module()

        self.assertEqual(module.slugify("The Last Brush LLC!"), "the-last-brush-llc")

    def test_extract_proposal_fields_from_markdown(self):
        module = load_module()
        markdown = """# Proposal: The Last Brush LLC Three-Page Website

Prepared by NexGen Studio
Date: 2026-06-03

## Quick Summary

A clean website proposal.

## Deliverables

| Deliverable | What It Includes |
|---|---|
| Custom Design | A unique layout. |

## Next Steps

Approve scope.
"""

        proposal = module.parse_markdown(markdown)

        self.assertEqual(proposal.title, "The Last Brush LLC Three-Page Website")
        self.assertEqual(proposal.date, "2026-06-03")
        self.assertEqual(proposal.sections["Quick Summary"].strip(), "A clean website proposal.")
        self.assertIn("Custom Design", proposal.sections["Deliverables"])

    def test_cover_title_lines_wrap_long_titles(self):
        module = load_module()

        lines = module.cover_title_lines("The Last Brush LLC Three-Page Website", max_chars=24)

        self.assertEqual(lines, ["The Last Brush LLC", "Three-Page Website"])

    def test_render_pdf_creates_text_searchable_pdf(self):
        module = load_module()
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            source = tmp_path / "proposal.md"
            output = tmp_path / "proposal.pdf"
            source.write_text(
                """# Proposal: Sample Client Website

Prepared by NexGen Studio
Date: 2026-06-03

## Quick Summary

Sample Client needs a clean three-page website.

## Deliverables

| Deliverable | What It Includes |
|---|---|
| Custom Design | A unique layout. |
| Contact Page | A form and contact details. |

## Investment

Investment: **[Anson to confirm final price]**

## Next Steps

Confirm scope.
""",
                encoding="utf-8",
            )

            module.render_pdf(source, output)

            self.assertTrue(output.exists())
            text = module.extract_pdf_text(output)
            self.assertIn("Sample Client Website", text)
            self.assertIn("Prepared by NexGen Studio", text)
            self.assertIn("Custom Design", text)


if __name__ == "__main__":
    unittest.main()

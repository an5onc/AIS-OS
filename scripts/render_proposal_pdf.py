#!/usr/bin/env python3
"""Render a NexGen Studio Markdown proposal into a branded PDF.

This script is intentionally small and dependency-light. It uses ReportLab for
PDF output, Pillow for logo cleanup, and pypdf only for verification helpers.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "brand-assets" / "nexgen"
DEFAULT_LOGO = BRAND_DIR / "nexgenlogo.png"
DEFAULT_OUTPUT_SUFFIX = "-branded.pdf"

CONTACT_SITE = "n3xg3nstudio.com"
CONTACT_EMAIL = "anson@nexgenstudio.io"
CONTACT_PHONE = "970.909.4951"

PAGE_W, PAGE_H = letter
MARGIN_X = 0.62 * inch

BLUE = colors.HexColor("#1477B9")
CYAN = colors.HexColor("#45C7D6")
DARK = colors.HexColor("#202830")
INK = colors.HexColor("#2E3338")
MUTED = colors.HexColor("#5E6A72")
GREEN = colors.HexColor("#79C956")
BORDER = colors.HexColor("#D9E3E8")


@dataclass
class Proposal:
    title: str
    date: str
    sections: dict[str, str]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "proposal"


def strip_markdown(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1 (\2)", text)
    return text


def parse_markdown(markdown: str) -> Proposal:
    title = "NexGen Studio Proposal"
    date = ""
    sections: dict[str, list[str]] = {}
    current: str | None = None

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        if line.startswith("# "):
            title = line[2:].strip()
            title = re.sub(r"^Proposal:\s*", "", title)
            continue
        if line.startswith("Date:"):
            date = line.split(":", 1)[1].strip()
            continue
        if line.startswith("## "):
            current = line[3:].strip()
            sections[current] = []
            continue
        if current:
            sections[current].append(line)

    return Proposal(
        title=title,
        date=date,
        sections={key: "\n".join(value).strip() for key, value in sections.items()},
    )


def extract_pdf_text(path: Path | str) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def output_path_for(markdown_path: Path) -> Path:
    stem = markdown_path.stem
    if stem.endswith("-draft"):
        stem = stem[: -len("-draft")]
    return markdown_path.with_name(f"{stem}{DEFAULT_OUTPUT_SUFFIX}")


def cover_title_lines(title: str, max_chars: int = 26) -> list[str]:
    words = title.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        candidate = " ".join([*current, word])
        if current and len(candidate) > max_chars:
            lines.append(" ".join(current))
            current = [word]
        else:
            current.append(word)
    if current:
        lines.append(" ".join(current))
    return lines[:3]


def prepare_brand_assets(logo_path: Path = DEFAULT_LOGO) -> tuple[Path, Path]:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(logo_path).convert("RGBA")
    bbox = base.getchannel("A").getbbox() or base.getbbox()
    cropped = base.crop(bbox)

    header = BRAND_DIR / "nexgenlogo-cropped.png"
    cover = BRAND_DIR / "nexgenlogo-cover-clean.png"
    cropped.save(header)

    clean = Image.new("RGBA", cropped.size, (0, 0, 0, 0))
    source = cropped.load()
    target = clean.load()
    for y in range(cropped.size[1]):
        for x in range(cropped.size[0]):
            r, g, b, a = source[x, y]
            if a < 20:
                continue
            is_green = g >= 105 and g > r * 1.08 and g > b * 1.08
            is_white = r >= 205 and g >= 205 and b >= 205
            if is_green:
                target[x, y] = (126, 210, 91, 255)
            elif is_white:
                target[x, y] = (255, 255, 255, 255)
    clean.save(cover)
    return header, cover


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=18, leading=23, textColor=BLUE, spaceBefore=10, spaceAfter=7))
    styles.add(ParagraphStyle("H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=DARK, spaceBefore=9, spaceAfter=5))
    styles.add(ParagraphStyle("Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.45, leading=12.8, textColor=INK, spaceAfter=6))
    styles.add(ParagraphStyle("Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2, leading=10.5, textColor=MUTED, spaceAfter=5))
    styles.add(ParagraphStyle("Bulletx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2, leading=12.2, leftIndent=13, firstLineIndent=-8, textColor=INK, spaceAfter=3.5))
    styles.add(ParagraphStyle("Callout", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=10.2, leading=13.5, textColor=DARK, backColor=colors.HexColor("#EAF7FA"), borderColor=colors.HexColor("#B6E4EC"), borderWidth=0.8, borderPadding=8, spaceBefore=6, spaceAfter=9))
    styles.add(ParagraphStyle("TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=8.5, leading=10.6, textColor=colors.white))
    styles.add(ParagraphStyle("TableCell", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.0, leading=10.0, textColor=INK))
    styles.add(ParagraphStyle("TableCellBold", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=8.1, leading=10.0, textColor=DARK))
    return styles


def paragraph(text: str, styles, style: str = "Bodyx") -> Paragraph:
    return Paragraph(strip_markdown(text), styles[style])


def bullet(text: str, styles) -> Paragraph:
    text = text.strip().lstrip("-").strip()
    return Paragraph(f"• {strip_markdown(text)}", styles["Bulletx"])


def draw_gradient(canvas, x, y, width, height, start=CYAN, end=BLUE, steps=90):
    sr, sg, sb = start.red, start.green, start.blue
    er, eg, eb = end.red, end.green, end.blue
    for i in range(steps):
        t = i / max(1, steps - 1)
        canvas.setFillColor(colors.Color(sr + (er - sr) * t, sg + (eg - sg) * t, sb + (eb - sb) * t))
        canvas.rect(x + width * i / steps, y, width / steps + 1, height, stroke=0, fill=1)


def render_markdown_table(lines: list[str], styles) -> Table:
    rows = []
    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("|"):
            continue
        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if all(re.fullmatch(r"-+", cell) for cell in cells):
            continue
        if not rows:
            rows.append([paragraph(cell, styles, "TableHead") for cell in cells])
        else:
            rows.append([
                paragraph(cells[0], styles, "TableCellBold"),
                *[paragraph(cell, styles, "TableCell") for cell in cells[1:]],
            ])

    if not rows:
        return Table([])

    col_count = len(rows[0])
    if col_count == 2:
        col_widths = [1.55 * inch, 4.98 * inch]
    elif col_count == 3:
        col_widths = [1.15 * inch, 4.05 * inch, 1.33 * inch]
    else:
        col_widths = [6.53 * inch / col_count] * col_count

    table = Table(rows, colWidths=col_widths, hAlign="LEFT", repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#F1F7F9")),
        ("GRID", (0, 0), (-1, -1), 0.45, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def section_flowables(title: str, body: str, styles) -> list:
    flowables = [paragraph(title, styles, "H1x")]
    table_buffer: list[str] = []
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped:
            if table_buffer:
                flowables.append(render_markdown_table(table_buffer, styles))
                table_buffer = []
            continue
        if stripped.startswith("|"):
            table_buffer.append(stripped)
            continue
        if table_buffer:
            flowables.append(render_markdown_table(table_buffer, styles))
            table_buffer = []
        if stripped.startswith("### "):
            flowables.append(paragraph(stripped[4:], styles, "H2x"))
        elif stripped.startswith("- "):
            flowables.append(bullet(stripped, styles))
        else:
            style = "Callout" if "Investment:" in stripped else "Bodyx"
            flowables.append(paragraph(stripped, styles, style))
    if table_buffer:
        flowables.append(render_markdown_table(table_buffer, styles))
    return flowables


def apply_replacements(text: str, replacements: dict[str, str]) -> str:
    for key, value in replacements.items():
        if value:
            text = text.replace(key, value)
    return text


def render_pdf(markdown_path: Path | str, output_path: Path | str | None = None, *, logo_path: Path = DEFAULT_LOGO, price: str = "", service_area: str = "") -> Path:
    markdown_path = Path(markdown_path)
    output = Path(output_path) if output_path else output_path_for(markdown_path)
    raw = markdown_path.read_text(encoding="utf-8")
    raw = apply_replacements(raw, {
        "**[Anson to confirm final price]**": f"**{price}**",
        "[Anson to confirm final price]": price,
        "Service area to be confirmed.": service_area,
    })
    proposal = parse_markdown(raw)
    header_logo, cover_logo = prepare_brand_assets(logo_path)
    styles = build_styles()

    story = [Spacer(1, 0.01 * inch), PageBreak()]
    preferred = [
        "Quick Summary",
        "What I Understand You Need",
        "Recommended Scope",
        "Deliverables",
        "Page Plan",
        "Local Market Context",
        "Why NexGen Studio",
        "Timeline",
        "Investment",
        "Investment Options",
        "What I Need From You",
        "Next Steps",
    ]
    ordered = [name for name in preferred if name in proposal.sections]
    ordered.extend(name for name in proposal.sections if name not in ordered)

    for name in ordered:
        story.extend(section_flowables(name, proposal.sections[name], styles))
        story.append(Spacer(1, 0.04 * inch))
        if name in {"Deliverables", "Local Market Context", "Investment"}:
            story.append(PageBreak())

    def cover(canvas, doc):
        canvas.saveState()
        draw_gradient(canvas, 0, 0, PAGE_W, PAGE_H)
        canvas.setFillColor(colors.Color(0, 0, 0, alpha=0.07))
        canvas.rect(0, 0, 0.58 * inch, PAGE_H, stroke=0, fill=1)
        canvas.rect(PAGE_W - 0.58 * inch, 0, 0.58 * inch, PAGE_H, stroke=0, fill=1)
        canvas.drawImage(ImageReader(str(cover_logo)), PAGE_W / 2 - 2.52 * inch, PAGE_H - 2.12 * inch, width=5.04 * inch, height=1.86 * inch, mask="auto")
        canvas.setStrokeColor(GREEN)
        canvas.setLineWidth(3)
        canvas.line(PAGE_W / 2 - 1.0 * inch, PAGE_H - 2.72 * inch, PAGE_W / 2 + 1.0 * inch, PAGE_H - 2.72 * inch)
        canvas.setFillColor(colors.white)
        title_lines = cover_title_lines(proposal.title)
        font_size = 30 if len(title_lines) == 1 else 26
        canvas.setFont("Helvetica-Bold", font_size)
        title_start = PAGE_H - 3.48 * inch if len(title_lines) > 1 else PAGE_H - 3.62 * inch
        for index, line in enumerate(title_lines):
            canvas.drawCentredString(PAGE_W / 2, title_start - (index * 0.36 * inch), line)
        canvas.setFont("Helvetica", 16)
        subtitle_y = PAGE_H - 4.15 * inch if len(title_lines) > 1 else PAGE_H - 4.04 * inch
        canvas.drawCentredString(PAGE_W / 2, subtitle_y, "Website / Digital System Proposal")
        canvas.setFont("Helvetica-Bold", 10.5)
        canvas.drawCentredString(PAGE_W / 2, subtitle_y - 0.38 * inch, f"Prepared by NexGen Studio • {proposal.date or 'Date pending'}")
        canvas.setFillColor(colors.Color(1, 1, 1, alpha=0.93))
        canvas.roundRect(1.0 * inch, 1.54 * inch, PAGE_W - 2.0 * inch, 1.55 * inch, 12, stroke=0, fill=1)
        canvas.setFillColor(DARK)
        canvas.setFont("Helvetica-Bold", 12)
        canvas.drawCentredString(PAGE_W / 2, 2.68 * inch, "Custom design • Mobile responsive • SEO-friendly setup • Ownership transfer")
        canvas.setFont("Helvetica", 10)
        canvas.drawCentredString(PAGE_W / 2, 2.34 * inch, "A clean proposal built around the client's business, market, and next step.")
        canvas.setFillColor(BLUE)
        canvas.setFont("Helvetica-Bold", 10.5)
        canvas.drawCentredString(PAGE_W / 2, 1.89 * inch, f"{CONTACT_SITE}   |   {CONTACT_EMAIL}   |   {CONTACT_PHONE}")
        canvas.restoreState()

    def content(canvas, doc):
        canvas.saveState()
        header_h = 0.76 * inch
        canvas.setFillColor(colors.white)
        canvas.rect(0, PAGE_H - header_h, PAGE_W, header_h, stroke=0, fill=1)
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN_X, PAGE_H - header_h, PAGE_W - MARGIN_X, PAGE_H - header_h)
        canvas.drawImage(ImageReader(str(header_logo)), MARGIN_X, PAGE_H - 0.66 * inch, width=1.62 * inch, height=0.60 * inch, mask="auto")
        canvas.setFont("Helvetica", 8.5)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 0.47 * inch, proposal.title)
        canvas.setStrokeColor(BORDER)
        canvas.line(MARGIN_X, 0.50 * inch, PAGE_W - MARGIN_X, 0.50 * inch)
        canvas.setFont("Helvetica", 7.8)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, 0.31 * inch, f"NexGen Studio  |  {CONTACT_SITE}  |  {CONTACT_EMAIL}  |  {CONTACT_PHONE}")
        canvas.drawRightString(PAGE_W - MARGIN_X, 0.31 * inch, f"Page {doc.page}")
        canvas.restoreState()

    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(output), pagesize=letter, rightMargin=MARGIN_X, leftMargin=MARGIN_X, topMargin=0.86 * inch, bottomMargin=0.70 * inch, title=proposal.title, author="NexGen Studio")
    doc.build(story, onFirstPage=cover, onLaterPages=content)
    return output


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Render a NexGen Studio Markdown proposal into a branded PDF.")
    parser.add_argument("proposal", type=Path, help="Path to the Markdown proposal.")
    parser.add_argument("--out", type=Path, help="Output PDF path. Defaults to <proposal>-branded.pdf.")
    parser.add_argument("--logo", type=Path, default=DEFAULT_LOGO, help="NexGen logo PNG.")
    parser.add_argument("--price", default="", help="Final price to replace [Anson to confirm final price].")
    parser.add_argument("--service-area", default="", help="Final service area to replace the service-area placeholder.")
    return parser


def main(argv: Iterable[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    output = render_pdf(args.proposal, args.out, logo_path=args.logo, price=args.price, service_area=args.service_area)
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

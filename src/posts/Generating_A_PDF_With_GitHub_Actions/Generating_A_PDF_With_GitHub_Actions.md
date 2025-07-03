---
title: Generating a PDF With GitHub Actions
subtitle: Leveraging Pandoc to generate a high-quality PDF from source Markdown files
img: build_pdf_yml.png
img_alt: A GitHub workflow YAML file with steps to utilize Pandoc
date: 2025-07-03
---

# Use Case

In the post before this one, I talked a bit about my process in migrating my notes on my current game design project to GitHub. This comes with a variety of benefits, one of which led me down a rabbit hole that, admittedly, shaved a few years off my life.

```yaml
# This action generates a PDF from all of the game's writing.
# Uses file_order.txt to determine the file input and order

name: Build PDF

on: push

jobs:
  convert_via_pandoc:
    runs-on: ubuntu-22.04
    permissions:
      contents: write
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Get File Order
        id: get_file_input
        run: |
          {
            echo 'FILE_ORDER<<EOF'
            echo "$(cat file_order.txt | tr '\r\n' ' ')"
            echo
            echo EOF
           } >> "$GITHUB_OUTPUT"

      - name: Convert Files with Pandoc
        uses: docker://fpod/pandoc-weasyprint
        with:
          args: >-
            --from=markdown
            --to=html
            --standalone
            --css="styles.css"
            --output="Writ_of_Rulers_v${{ github.run_number }}.pdf"
            -V papersize:letter
            --pdf-engine=weasyprint
            ${{ steps.get_file_input.outputs.FILE_ORDER }}

      - name: Upload PDF as Release
        uses: actions/upload-artifact@v4
        with:
          name: "Writ of Rulers"
          path: "Writ_of_Rulers_v${{ github.run_number }}.pdf"
          overwrite: true

      - name: Upload PDF as Artifact
        uses: ncipollo/release-action@v1
        with:
          artifacts: "Writ_of_Rulers_v${{ github.run_number }}.pdf"
          tag: "Writ_of_Rulers_v${{ github.run_number }}"
          name: "Writ of Rulers v${{ github.run_number }}"
          makeLatest: true

```

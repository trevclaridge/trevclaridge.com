---
title: Generating a PDF with GitHub Actions
subtitle: Leveraging Pandoc to generate a high-quality PDF from Markdown source files.
img: build_pdf_yml.png
img_alt: A GitHub workflow YAML file with steps to utilize Pandoc.
date: 2025-07-03
---

**!! For those looking for the technical solution I came to, my entire workflow yaml file can be found at the end, along with a link to the file in GitHub in case of any changes. !!**

## Use Case

[In the post before this one](../Using_GitHub_To_Host_My_TTRPG_Design_Project), I talked a bit about my process and reasoning in migrating my notes on my current game design project to GitHub. This comes with a variety of benefits, one of which led me down a rabbit hole that, admittedly, shaved a few years off my life.

One of the main problems I foresaw with my migrating all my game notes to GitHub is that sharing the *whole* game with folks would be a cumbersome. It's easy enough for me to link people my repo, but the repo is a complex tree of markdown files that is difficult to parse through. I like to have my writing fairly silo'd, with each mechanic having its own markdown file. This just helps me mentally separate out the logical pieces, as well as making it easier to see changes in the git diff viewer. There is no logical "beginning" for where to begin reading; of course, I could put a note to that effect in the README and direct readers' eyes towards the relevant directories, but that is a lot to ask of someone already being very generious investing time in reading a *draft* of a game. So, I resolved to make that process easier by finding a way to join all of my various markdown files into a single PDF, via an automated process in a GitHub action.

## Failed Attempts

This turned out to be a 2 days-long problem, with many a failed endeavor. I think I landed somewhere in the realm of 100 unique commits, just trying to find the right magic spell to get the action to do what I wanted. But, we try and try again, and I'm happy to say I found a solution that I'm really happy with.

For those who might find this post in their attempts in the future, however, I'm just mention the couple of GitHub actions that I tried to use, but ultimately gave up on.

### [Markdown-to-PDF](https://github.com/BaileyJM02/markdown-to-pdf)

This was a promising lead because other GitHub actions linked to it after being deprecated. It also supports styling with CSS, which was a big deal for me (more on that later).

If I'm remembering correctly, my big issue with this option was that I couldn't specific an ordering to the markdown files; the only options were path-to-specific-file or path-to-directory-with-files. For my project, I really need my pdf to join the markdown files in a specific sequence, or mechanics and explainations of rules could wind up mixed in with other non-relevant information, leading to confusion. And, thus I moved on to find another tool.

### [Publish-Markdown-As-PDF](https://github.com/marketplace/actions/publish-markdown-as-pdf)

This is one of the actions that linked to Markdown-to-PDF. Right away, I noticed that the `sources` argument available in this action gave a list of individual document sources. Along with a number of other features, this action seemed to allow the specification of an order in which to stitch the inputs, awesome!

The problem for this action was, unfortunately, that it had a lot of trouble recognizing the sources I specified!

![A meme of Captain Picard from Star Trek faceplaming.](picard-meme-facepalm.webp)

To be honest, this was mostly my fault, as I've been naming my directories and files with spaces included (I like the way it looks 🤷). This action didn't seem to understand what I wanted to include, regardless of quotes or formatting. So, we move on again.

## Solution: Pandoc

Enter the tool that makes this all possible. [Pandoc](https://pandoc.org/) is super powerful command-line tool that can convert files between a *huge* list of supported file types. I mean, just look at this visualizer of the possible permutations they have on their website:

![A large node-graph showing all of the possible conversions available in Pandoc.](pandoc-file-conversions.png).

For our purposes, we are most interested in markdown to pdf, but you may also be interested in markdown to html, or docx, or epub, or a slew of Wiki markup formats.

Pandoc also allows for specifying the ordering of file inputs, horray!

There is a popular [Pandoc GitHub Action](https://github.com/pandoc/pandoc-action-example), which provides a number of docker containers for which to run Pandoc. I ran the gambit of the available docker containers in my efforts, but reasons I'll explain in a bit, I actually had to switch to a community docker that was built off the "official" containers.

First things first though, if your use case if fairly simple, perhaps you only need to convert one document to something like html, you can probably just follow the documentation in the README of the action to get going, it's a surprising simple tool. In terms of getting to know how to use Pandoc, I also recommend these few of YouTube tutorials I watched from [chantastic](https://youtu.be/bHMIL822NVs?si=rapsK928z-S7nMdL), [The Mouseless Dev](https://youtu.be/-S8-a_YS6tc?si=xB01uh4WyPst0BmO), [Brodie Robertson](https://youtu.be/lMIlNsi3eAY?si=ERfOZCKAAyHE6ZEv).

### Using Pandoc

The first thing that the documentation of the GitHub Action mentions is that, if you are trying to convert anything to PDF, you will want to use their LaTeX docker container, `pandoc/latex`. Pandoc uses LaTeX to create PDF documents, and this container includes LaTeX as well as a few common LaTeX packages. **Do not be deceived!** In my struggles, I found it was much easier to use the `pandoc/extra` container, which includes a whole bunch more LaTeX packages, one of which allowed me to have bullet point lists with indention levels more than 6 levels deep, [see here for the code that I used](https://github.com/jgm/pandoc/issues/2922#issuecomment-360201454).

With just a few changes, this action got me 80% of the way to my goal. It was the final 20% that drained my soul.

#### External list for the file order

This one took about 7 years off my life, give or take a year.

I was so sure that this was going to be an easy little enhancement I could add in to make my yaml file a little cleaner. No. Wrong. I'll spare all the details, but in the end I finally have an good 'ole [txt file at the root of my repo](https://github.com/trevclaridge/Writ-of-Rulers/blob/main/file_order.txt) that lists all of the file paths to the markdown files I want and in the order I want. See the "Get File Order" part of the workflow file below.

#### Additional Unicode Symbols

I'd say, 8 or 9 years for this one. Turns out, LaTeX really sucks!. I mean, it's great, but it sucks.

The following glyph caused hours of frustration for me:

⇔

Observe it and despair.

So, if I'm understanding this correctly (which, it is entirely possible that I'm not), this was a problem of the font used by LaTeX to generate the pdf text--that the specific font didn't have the glyph for the that double arrow character. This caused warnings in the build process, but LaTeX still generates the file, just without the characters it doesn't know. There were a few blank spaces in the resulting document, which wouldn't have been the end of the world, but at this point I was thinking, "I'm *this* close to 100%," so I went through the trouble of trying to add the character to the unicode set that LaTeX was using. Advice online was to just the `newunicodechar` LaTeX package, which I attempted.

Unfortunately, the neither the `pandoc/latex` or `pandoc/extra` docker containers have this package included. I went down the rabbit hole of trying to add the package the containers (still don't know how to do this, and would like to learn), as well as trying to install Pandoc and related packages directly into the GitHub runner.

This whole process was really starting to get to me, and I have to admit to giving up briefly around this time. I never actually solved this issue in the way that I wanted; that becomes irrelevant later, though, to wonderous cause.

#### CSS styling

## The Final YAML

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

[GitHub link to the version of this file I'm currently using](https://github.com/trevclaridge/Writ-of-Rulers/blob/main/.github/workflows/build-pdf.yml)

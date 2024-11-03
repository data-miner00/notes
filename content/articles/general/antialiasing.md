---
title: Antialiasing
description: Debunking what antialiasing is in a very high level
topic: Graphics
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - graphics
  - game
  - algorithm
updatedAt: 2024-10-27T10:22:03.695Z
createdAt: 2024-10-27T10:22:03.695Z
---

I've heard about the jargon anti-aliasing a lot but didn't gather enough courage to actually find out what it is as I thought it is something that only some deranged mathematician can understand. Turns out that I was wrong and it was dead simple.

<!--more-->

It's basically a technique used in computer graphics to smooth out jagged edges in digital images, games and other 3D-rendered environments.

## Scenario

Let's take the monitor for example. It doesn't matter if you use Samsung or Prism+, whatever is presented on the screen is comprised of an innumerable amount of squares (a.k.a pixels) arranged in a two-dimensional grid, working together by synchronizing the colors to manifest whatever it is being displayed.

However, as the pixels are sufficiently small for the naked eye to be observed, it gives us an illusion of perfection when the shape that has diagonal lines and curves are displayed on the screen.

## Usages

Anti-aliasing works by blurring out the rough edges of the pixels to give a smoother transition for the lines to look more natural.

![Illustration of aliasing and antialiasing](/images/antialiasing/03_engl-1024x513.jpg)

<!-- Original image @ https://vokigames.com/wp-content/uploads/2022/08/03_engl-1024x513.jpg -->

> Image adopted from [vokigames.com](https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/).

Anti-aliasing is prevalent in video games. It is intended to improve the quality of the graphics especially when it is a 3D-based game. Video games often provide several different anti-aliasing techniques to cater to wider audiences with different hardware specs.

Other uses of anti-aliasing include

1. Digital text rendering - Modern CSS provides a property called [`text-rendering`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering) which allows to specify whether to use anti-aliasing to improve legibility of a font. TailwindCSS also have a page for [font smoothing](https://tailwindcss.com/docs/font-smoothing).
2. Image processing - Improve the quality of resized or underscaled images

## Techniques of Antialiasing

However, the antialiasing process does impose some extra computing power. Different anti-aliasing techniques employ different algorithms that ultimately affect their performance and quality. Here is a non-exhaustive list of anti-aliasing technique.

![Antialiasing algorithm spectrum](/images/antialiasing/antialiasing-spectrum.png)

These are the names of the techniques mentioned above.

- **Fast Approximate Antialiasing (FXAA)**
- **Subpixel Morphological Antialiasing (SMAA)**
- **Temporal Antialiasing (TAA)**
- **Supersampling Antialiasing (SSAA)**
- **Multisample Antialiasing (MSAA)**

To learn more about each of them, there are a lot of articles that already cover them in depth. Refer to this [blog post](https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/) by Vokigames and this [blog post](https://www.hp.com/us-en/shop/tech-takes/what-is-anti-aliasing) by HP to learn more about the individual techniques.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Cabading, Z # Zach Cabading
title: "What is Anti-Aliasing? A Comprehensive Guide to Smoother Gaming Graphics"
url: https://www.hp.com/us-en/shop/tech-takes/what-is-anti-aliasing
date: 2024, August 27
source: websites
---
::

::apa-reference
---
authors:
 - CGJournalist
title: "What is Anti-Aliasing?"
url: https://www.youtube.com/watch?v=iqdVZr-TEHI
date: 2023, May 7
source: websites
---
::

::apa-reference
---
organization: Voki Games
title: "Anti-Aliasing in Gaming: The Battle for Perfect Graphics"
url: https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/
date: 2022, August 24
source: websites
---
::
<!-- prettier-ignore-end -->

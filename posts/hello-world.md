<!-- ## Why Write?

I've been meaning to start a blog for a while. There's a lot of work I do that doesn't fit neatly into a GitHub repo — research notes, design decisions, things I learned the hard way, ideas I want to think through in public.

This is that place.

## What to Expect

Posts here will mostly be about:

- **Audio DSP** — filter design, convolution, synthesis, plugin architecture
- **Software** — tools I build, patterns I find useful, things that surprised me
- **Music** — production notes, arrangement ideas, session reflections

No fixed schedule. I'll write when I have something worth saying.

## How This Works

This blog is rendered client-side from plain Markdown files. No CMS, no build step — just a `.md` file and a JSON manifest entry. The renderer uses [marked.js](https://marked.js.org/) with [highlight.js](https://highlightjs.org/) for code blocks.

Here's what a code block looks like:

```python
import numpy as np

def biquad_lpf(fc, fs, Q=0.707):
    """Second-order lowpass filter coefficients (Direct Form I)."""
    w0 = 2 * np.pi * fc / fs
    alpha = np.sin(w0) / (2 * Q)
    b0 =  (1 - np.cos(w0)) / 2
    b1 =   1 - np.cos(w0)
    b2 =  (1 - np.cos(w0)) / 2
    a0 =   1 + alpha
    a1 =  -2 * np.cos(w0)
    a2 =   1 - alpha
    return [b0/a0, b1/a0, b2/a0], [1, a1/a0, a2/a0]
```

And a blockquote:

> The test of all knowledge is experiment. Experiment is the sole judge of scientific "truth."
> — Richard Feynman

More soon. -->


# A Place for my thoughts

With just under four weeks remaining in my academic journey, I find myself reflecting on my time in school whenever I have a free moment.
The people I met, the things I learned, the music and technology created and shared along the way has shaped me more than I can express in a `README.md`.

I decided to dust off the `writing.html` that has sat dormant on this website and start putting my thoughts here. For now, it is a way to journal my thoughts and document what has been on my mind.  For later, it will serve as a nice time capsule that explores my journey after finishing my Master's degree at Georgia Tech.

# Reflections from a former child

It's not just GT that has been on my mind -- it's the bass lessons I took at 7 or 8 years of age. It's the middle school orchestra concerts, the jazz band rehearsals, and even the calculus class I took in high school where I pompously asked why I, an aspiring musician, would need to know calculus in my professional life.

If only I had known that a couple years after passing that calculus class I would be fighting for my academic life in a COVID-19 quarantine dorm room taking a Calculus 1 exam while my neighbor blasted music from the next room over, or crying over the Physics homework about approximating a figure skater as a cylinder that was eating away at my last brain cell. So many times I have reflected on what I could have done to better prepare myself for college -- but the struggle is part of the journey.

All in all, I think I owe some of my teachers a letter. This blog post might be the first iteration of that. To the past teachers of mine that are probably not reading this: thank you.

# Duality of Creative Technologism

Getting a degree or two in music technology has felt like a 4D chess move with consequences that even I was unaware of. On one hand, I wanted to feed the improviser and songwriter in me who likes jazz and the Grateful Dead, so I went to music school. On the other hand, I wanted to find technical success by learning "real world" skills, so I decided to split the difference.

What I found about myself was that the math and engineering courses I avoided like the plague in high school were just the same as learning jazz. Practice the theory, rehearse the changes, and ace the gig (or at least bruise your ego while trying).

Still, there exists a constant fight to play enough music to fulfill my creativity while still learning and deploying cutting-edge technology. I wish I could say I have solved this by performing music with robots, but this alone is not enough. 

I took up a one-credit jazz combo class this semester, and it has been a blast getting my upright bass chops back after over a year of hiatus (and much longer of a hiatus for jazz performance). Sharing this part of my life with my new friends and mentors has been a great way of showing the whole of me to my community. I think this is really important and something I have neglected since moving to Atlanta. 

I haven't released music since coming to Tech besides the residual tracks [Pulp Love](https://open.spotify.com/artist/14AW2mNZXQ68wvaLDBIaWj) has been sitting on. I have a habit of not putting in the work to finish my music in any real sense -- a habit that has been hard to shake.

# What's next

I am lucky to have gotten to where I am today, and that luck extends to having the best partner, the best cat, and a dream job lined up after graduation.

Surely, I will continue to create. Create music, create technologies, create lasting memories. I hope to strengthen old friendships as I return to New England, and find new ones in a new city.

With any luck, I'll keep you, dear reader, posted here.



<!-- # AI, music, and AI music

The biggest thing I have learned in this degree program is building can be done faster than ever. I resist the label of vibe coder, but I admit that much of what I release now is thanks to AI. It has given me a fresh way to iterate through my creative technologies.

I've also made music with AI. It is a very touchy subject today. I could say the truth here -- that I made music with AI because it was a small part of my summer job in 2024, but the truth goes deeper than that. There was still human collaboration, sitting in a living room with my bass hooked up to an interface, bouncing ideas off my friends who were roped into the same project as I was. Honestly, we all loathed it to some extent, but I can't say if it was because there was AI involved or because it was just another a deadline we were pushing up against. 

Flashing forward to Spring 2025, I tried my hand in applying AI generated music to a robotic system. It was perhaps the most unrewarding technological endeavour in recent years. I had no agency over the output. It was an interesting pipeline, but it all led down the drain in hindsight. After that, and some conversations with those in the AI music industry, I was no longer able to say that AI music was something I was pursuing because I enjoyed it, rather that it was something I was pursuing because it was cool on paper.

I came back to Tech in the Fall with reignited purpose: ditch AI generated music and approach the intersection of music and machine learning in a totally different light. This all led to my masters project where I taught our guitar playing robot a new skill using reinforcement learning, which is a project worthy of its own post. -->
## GuitarBot

GuitarBot is a robotic guitarist at Georgia Tech's Robotic Musicianship laboratory. Upon joining the lab, I was immediately drawn to the project in order to further the robot's ability to play with human musicality.

I developed two systems: GuitarBot Jams and GuitaRL.

GuitarBot Jams was a system to leveraged the [Stanford Anticipatory Music Transformer](https://crfm.stanford.edu/2023/06/16/anticipatory-music-transformer.html), a cutting edge open-source generative music model, to listen to a human guitarist and "improvise" with their input.

GuitaRL was a research project that wanted to help address GuitarBot's consistency and musicality. The first step was developing an audio-aware system that would compare the intended action of the robot (such as plucking a specific fret on a specific string) with the audio output. 
This allowed for event-time diagnostics using music information retrieval (MIR), which laid the groundwork for the full GuitaRL system to use reinforcement learning to teach the GuitarBot a new skill: natural harmonics.

GuitaRL is part of ongoing research at Georgia Tech, and the results are still unpublished at this time. Though, the system shows promise to create a new framework for audio-aware musical robotics.

## The Sequencer

To actually get music onto the robot, I built a browser-based MIDI workstation from scratch, tailored specifically to GuitarBot's mechanical capabilities — string and fret layout, pluck speed, slide behavior — so every note placed in the editor is something the robot can physically play before it's ever uploaded.

![GuitarBot Sequencer UI](assets/guitarbot-sequencer.png)

Want to hear it in action? Check out [the performance on my Music page](music.html).

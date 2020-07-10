# [Stargate: Planetary Defense](www.scottschupbach.com/planetarydefense) [🔗](https://www.scottschupbach.com/planetarydefense)
Only you can save Earth from total annihilation.

## Plot
The Goa'uld have sent a storm of asteroids hurtling toward Earth in an attempt to obliterate its inhabitants once and for all. Atlantis, fending off its own Wraith attack, could only spare a single PuddleJumper to counter the Goa'uld assault. You must blast the asteroids out of the sky before they can enter the atmosphere and wreak havoc on earth below.

## Features
Stargate: Planetary Defense is built with HTML5 Canvas. I initially tried to use KeyMaster to handle the various game input events, however I quickly learned that it did not handle multiple simultaneous key presses very well. I solved this by writing my own [custom key handler](https://github.com/scottyschup/planetarydefense/blob/gh-pages/lib/keyMonkey.js).

The game features different levels of difficulty (i.e. asteroid velocity/number of asteroids on the screen simultaneously) and various lengths (number of total asteroids in queue). Another condition I added to make the game require a little more strategy was to make the drones (bullets) limited, but more intelligent (as they are in the Stargate universe). To do this I gave the [Drone class](https://github.com/scottyschup/planetarydefense/blob/gh-pages/lib/drone.js) an `isNearTarget` function that checks for asteroids within a certain radius and a `redirect` function to adjust course accordingly.

I also gave moving objects the ability to collide and bounce off of each other. This functionality applies to asteroids colliding with other asteroids, or asteroids colliding with a shielded ship. I coded [the vector-based two-dimensional elastic collisions](https://github.com/scottyschup/planetarydefense/blob/gh-pages/lib/movingObject.js#L17) from [an overview of the topic by Chad Berchek](http://www.vobarian.com/collisions/2dcollisions2.pdf). 

## TODO:
- [ ] Increase gravitational force as objects near the bottom of the screen
- [ ] Add touch/gyro controls for smartphones/tablets
- [ ] Make the screen size more dynamic (currently doesn't handle skinny or tall viewports very well
- [ ] Leave smouldering impact points on the surface of Earth where each asteroid hits
- [ ] Add background music and sound effects

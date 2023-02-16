# Gloople Blobble Tower Twaddle

Can you stop the endless hoarde of Gloops from eating your face?

Build powerful towers and command the elements with superpowers to stop the
Gloops in their tracks!

The Gloops are endless. How long can you survive?

## Starting the game

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Press the play button to start the game

![Play Button](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/ui-play.png "Play Button")

## Objective

Prevent the Gloops that enter from the left of the game screen from reaching the exit on the right side. 

## Mechanics

Gloops can be stopped by building defensive towers on tower build locations as indicated by the mallet icon.

![Tower Build Location](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/tower-build-location.png "Tower Build Location")

There are two types of towers; meteor and quake.
A meteor tower targets one gloop at a time for high damage. A quake tower targets all gloops within range for medium damage.

![Meteor Tower](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/tower-meteor.png "Meteor Tower")
![Quake Tower](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/tower-quake.png "Quake Tower")

Upgrading towers will improve their range and damage output.

![Upgrade Tower Button](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/ui-upgrade-tower.png "Upgrade Tower Button")

Player can also use super powers to target the Gloops. There are three superpowers; acid-rain, fireball and rocks, all accessible at the bottom of the screen.

![Superpowers](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/ui-superpowers.png "Superpowers")

If a player is unable to stop a Gloop from reaching the other side, the player will lose 1 HP, if a player loses all of their HP, the game is over.

When a player kills Gloops, they earn gems. Gems can be used to purchase towers and upgrade them to become more powerful.

Gloops will come in waves with a 15-second delay within each wave and become more numerous, faster, and have more health with each new wave.

A player can call the next wave early and will be rewarded with gems for doing so.

![Next Wave Button](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/ui-hourglass.png "Next Wave Button")

A player can see their gem stash, total health and the current wave number in the top left.

![Gem Status UI](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/ui-player.png "Gem Status UI")

## Screenshots

![Start Screen](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/screen-start.png "Game Start")
![Active Game Screen](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/screen-active.png "Game Active")
![Game Over Screen](https://github.com/digital-bacon/gloople-blobble/blob/main/docs/screen-gameover.png "Game Over")

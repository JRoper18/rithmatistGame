# Rithmatist Game

This is a game based off of Brandon Sanderson's [The Rithmatist](http://brandonsanderson.com/books/the-rithmatist/the-rithmatist/).

Features Implemented:
- Circle Bind Points
- Chalkling Animations and Basic AI
- Straightlines

Things I haven't done:
- Non-perfect circle recognition
- Lines of Vigor
- Local multiplayer
- More than 1 chalkling
- Actual game mechanics

If you want to contribute, just submit a pull request. I'll probably approve it.

If you have any animations or chalklings you would like to send to me, I'll take any file type and transform it myself.
Send all chalkling ideas/animations/assets to: jackroper18@gmail.com (me).

Also, if you want to try it yourself, you can download this repo. Run "npm run dev-server" and open up localhost:8080/webpack-dev-server


UPDATE: Actually, I've declared this project impossible until I use something other than javascript. The update-render method takes 100's of ms. Updating the DOM takes more 100's. I could fix the DOM issue by switching to a canvas or WebGL-based renderer, but that doesn't get rid of the fact that the update is still too slow to get anything above ~10fps. Either I have to optimize this game better than Carmack, which I can't do, because I'm not Carmack, or give up. I give up.  
# AudioHub (previously AudioPlayerJS)
A little application I thought I'd write - using the Electron framework in a Node.js environment.
This could possibly be the replacement/successor/new-version of my <a href="https://github.com/mikejzx/AudioPlayerJS">MusicPlayer++ Win32 application</a>,
as this app would be more portable, practical, versatile, (and easier to write) due to the cross-platform nature of the Electron Framework. Though I do enjoy writing C++ alot more, I felt as though it was impractical to write a huge Win32 application, (I may periodically commit to it anyway just for the hell of it, though a bit of intermission between commits can be expected over there.)

# No builds yet. (Getting closer...)

# Build requirements:
* Electron framework: `npm install electron --save`
* jsmediatags (for ID3 reading): `npm install jsmediatags --save`
* And ofcourse Node.js with the npm (Node.js package manager). Install with your system's package manager like so, `sudo pacman -S nodejs`, `sudo apt install nodejs`, etc... (npm is installed alongside the 'nodejs' package. If you are building the application from a Windows system, Node.js (with npm included) can be downloaded from <a href="https://nodejs.org/en/">here.</a>)
<br>
<hr>
<br>
16.04.2019: Repository was moved here (from <a href="https://github.com/mikejzx/AudioPlayerJS">'AudioPlayerJS'</a>) as the original had completely distorted 'committed line-count' due to the removal of the node_modules directory from the repository.<br>
14 commits are no longer apart of this repository, but can be found in the archived version of <a href="https://github.com/mikejzx/AudioPlayerJS">here</a> for reference. node_modules has since been added to the .gitignore to prevent this from happening again.

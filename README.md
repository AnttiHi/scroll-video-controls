# Scroll wheel video controls
A simple userscript for controlling the volume and playback speed of videos using a scroll wheel.

## Installation and usage
Install a userscript manager like Tampermonkey ([Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)), then click [here](https://github.com/AnttiHi/scroll-video-controls/raw/refs/heads/main/Scroll-video-controls.user.js) to install the userscript.

Hover the mouse cursor over a video and use the scroll wheel to change the video volume or ctrl + scroll wheel to control the playback speed. After adjusting the playback speed, you can switch between the adjusted speed and the original speed using the middle mouse button.
You can also switch between mono and stereo audio by pressing the 'N' key on the keyboard.

When adjusting volume to over 100%, a dynamic compressor is used to prevent excessive spikes in volume.

Made for YouTube but works on some other sites too.

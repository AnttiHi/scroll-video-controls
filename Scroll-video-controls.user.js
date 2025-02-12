// ==UserScript==
// @name         Scroll wheel video controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use scroll wheel to control video volume and playback speed
// @author       https://github.com/AnttiHi
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const videos = document.querySelectorAll('video');
    let prevSpeed = 1;
    let timer = null;

    const displayDiv = document.createElement('div');
    displayDiv.style.position = 'absolute';
    displayDiv.style.padding = '10px';
    displayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    displayDiv.style.color = 'white';
    displayDiv.style.borderRadius = '5px';
    displayDiv.style.fontSize = '16px';
    displayDiv.style.zIndex = '9999';
    displayDiv.style.display = 'empty';
    document.body.appendChild(displayDiv);

    function updateDisplay(video) {
        displayDiv.textContent = '';

        const volumeText = document.createElement('span');
        volumeText.textContent = `Volume: ${Math.round(video.volume * 100)}%`;

        const speedText = document.createElement('span');
        speedText.textContent = `Speed: ${video.playbackRate.toFixed(2)}x`;

        displayDiv.appendChild(volumeText);
        displayDiv.appendChild(document.createElement('br'));
        displayDiv.appendChild(speedText);

        const rect = video.getBoundingClientRect();
        displayDiv.style.top = `${rect.top + window.scrollY + 10}px`;
        displayDiv.style.left = `${rect.left + window.scrollX + 10}px`;

        displayDiv.style.display = 'block';

        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            displayDiv.style.display = 'none';
        }, 1500);
    }

    videos.forEach(video => {
        video.addEventListener('mousedown', function (event) {
            if (event.button === 1) {
                event.preventDefault();
                if (video.playbackRate != 1) {
                    prevSpeed = video.playbackRate;
                    video.playbackRate = 1;
                }
                else {
                    video.playbackRate = prevSpeed;
                }
                updateDisplay(video);
            }
        });
        video.addEventListener('wheel', function (event) {
            if (event.target === video) {
                event.preventDefault();
                if (event.ctrlKey) {
                    // Adjust playback speed
                    if (event.deltaY < 0) {
                        video.playbackRate = Math.min(video.playbackRate + 0.2, 3);
                    } else if (event.deltaY > 0) {
                        video.playbackRate = Math.max(video.playbackRate - 0.2, 0.4);
                    }
                    updateDisplay(video);
                } else {
                    // Adjust volume
                    if (event.deltaY < 0) {
                        video.volume = Math.min(video.volume + 0.05, 1);
                    } else if (event.deltaY > 0) {
                        video.volume = Math.max(video.volume - 0.05, 0);
                    }
                    updateDisplay(video);
                }
            }
        });
    });
})();

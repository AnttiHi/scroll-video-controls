// ==UserScript==
// @name         Scroll wheel video controls
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Use scroll wheel to control video volume and playback speed
// @author       https://github.com/AnttiHi
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';
    let videos = null;
    let prevSpeed = 1;
    let timer = null;
    let vidCount = 0;

    const displayDiv = document.createElement('div');
    displayDiv.style.position = 'absolute';
    displayDiv.style.padding = '10px';
    displayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    displayDiv.style.color = 'white';
    displayDiv.style.borderRadius = '5px';
    displayDiv.style.fontSize = '16px';
    displayDiv.style.zIndex = '9999';
    displayDiv.style.display = 'none';

    const observer = new MutationObserver(() => {
        videos = document.querySelectorAll('video');
        if (videos.length != vidCount) {
            vidCount = videos.length;
            addControls();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function updateDisplay(video, volume) {
        displayDiv.textContent = '';

        const volumeText = document.createElement('span');
        volumeText.style.color = volume > 1 ? 'LightPink' : 'white';
        volumeText.textContent = `Volume: ${Math.round(volume * 100)}%`;

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

    function addControls() {
        console.log("ADDING CONTROLS");
        videos.forEach(video => {
            if (video.dataset.controlsAdded){
                console.log("JOO");
                return;
            }
            video.dataset.controlsAdded = "true";
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaElementSource(video);
            let volume = video.volume;

            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-50, audioCtx.currentTime);
            comp.knee.setValueAtTime(40, audioCtx.currentTime);
            comp.ratio.setValueAtTime(1, audioCtx.currentTime);
            comp.attack.setValueAtTime(0, audioCtx.currentTime);
            comp.release.setValueAtTime(0.25, audioCtx.currentTime);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(1, audioCtx.currentTime);

            source.connect(gain);
            gain.connect(comp);
            comp.connect(audioCtx.destination);

            document.body.appendChild(displayDiv);
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
                    updateDisplay(video, volume);
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
                        updateDisplay(video, volume);
                    } else {
                        // Adjust volume
                        if (event.deltaY < 0) {
                            if (video.volume < 1) {
                                video.volume = Math.min(video.volume + 0.05, 1);
                            } else {
                                comp.ratio.setValueAtTime(Math.min(comp.ratio.value + 0.5, 11), audioCtx.currentTime);
                                gain.gain.setValueAtTime(Math.min(gain.gain.value + 0.5, 11), audioCtx.currentTime);
                            }
                        } else if (event.deltaY > 0) {
                            if (gain.gain.value > 1) {
                                comp.ratio.setValueAtTime(Math.max(comp.ratio.value - 0.5, 1), audioCtx.currentTime);
                                gain.gain.setValueAtTime(Math.max(gain.gain.value - 0.5, 1), audioCtx.currentTime);
                            } else {
                                video.volume = Math.max(video.volume - 0.05, 0);
                            }
                        }
                        volume = video.volume + ((gain.gain.value - 1) * 0.1);
                        updateDisplay(video, volume);
                    }
                }
            });

        });
    }
})();

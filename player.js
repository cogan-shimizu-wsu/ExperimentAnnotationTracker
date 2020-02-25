//
// Written by Garrett G. Goodman
// goodman.27@hotmail.com
//

// References to the video user-interface items
const myVideo = document.getElementById('myVideo');
const btnVideoPlay = document.getElementById('btnVideoPlay');
const btnVideoPause = document.getElementById('btnVideoPause');
const btnVideoStop = document.getElementById('btnVideoStop');
const btnVideoBackwards = document.getElementById('btnVideoBackwards');
const btnVideoForwards = document.getElementById('btnVideoForwards');
const btnVideoFastBackwards = document.getElementById('btnVideoFastBackwards');
const btnVideoFastForwards = document.getElementById('btnVideoFastForwards');
const outputCurrentVideoSpeed = document.getElementById('outputCurrentVideoSpeed');
const btnAddVideo = document.getElementById('btnAddVideo');
const outputTrackerScoring = document.getElementById('outputTrackerScoring');
const trackerInputBox = document.getElementById('trackerInputBox');
const btnTrackerPlay = document.getElementById('btnTrackerPlay');
const btnTrackerPause = document.getElementById('btnTrackerPause');
const btnTrackerStop = document.getElementById('btnTrackerStop');
const fileLocation = 'Videos/'; // JavaScript does not allow choosing specific locations for files (security reasons apparently). It needs a predefined file path.

// Add event listeners for each of the video buttons
btnVideoPlay.addEventListener('click', vidAction); // On click, trigger a corresponding function
btnVideoPause.addEventListener('click', vidAction);
btnVideoStop.addEventListener('click', vidAction);
btnVideoBackwards.addEventListener('click', vidAction);
btnVideoForwards.addEventListener('click', vidAction);
btnVideoFastBackwards.addEventListener('click', vidAction);
btnVideoFastForwards.addEventListener('click', vidAction);
btnAddVideo.addEventListener('click', openVideo);
btnTrackerPlay.addEventListener('click', trackerVidAction);
btnTrackerPause.addEventListener('click', trackerVidAction);
btnTrackerStop.addEventListener('click', trackerVidAction);
trackerInputBox.addEventListener('input', trackerTimeTextBox);

// Variables used withing the functions below
trackerInputBox.value = 0;
var trackerTimeInitialized = 0;
var trackerTime = 0;
var refreshIntervalId = null;

// Function updates the initially entered scoring time every time a new number is entered.
function trackerTimeTextBox() {
    trackerTimeInitialized = trackerInputBox.value;
    trackerTime = trackerTimeInitialized;
}

// Function is called every second to update the value within the "Scoring Time (sec)" text box.
function updateTime() {
    if (trackerTime != 0) {
        // Update the time
        trackerInputBox.value = trackerTime--;
    } else {
        trackerInputBox.value = null;
        myVideo.pause();
        clearInterval(refreshIntervalId);
        keydownHandlers[lastScoredBehaviour.key]();
        scoringTabActive = false;
        console.log(current_experiment.timeline);
    }
}

// Function handles click events for the buttons below the video player.
function trackerVidAction(event) {
    switch (event.target.id) {
        case "btnTrackerPlay":
            if (trackerTime !== 0 || trackerTime !== null) {
                scoringTabActive = true;
                // Capture the max length of the tracker, i.e. the session length
                if (current_experiment.scoring_session_length < trackerTime) {
                    current_experiment.scoring_session_length = trackerTime;
                }
                myVideo.play();
                refreshIntervalId = setInterval(updateTime, 1000);
                break;
            }
        case "btnTrackerPause":
            scoringTabActive = false;
            myVideo.pause();
            clearInterval(refreshIntervalId);
            break;
        case "btnTrackerStop":
            scoringTabActive = false;
            clearInterval(refreshIntervalId);
            myVideo.pause();
            myVideo.currentTime = 0;
            myVideo.playbackRate = 1.0;
            trackerInputBox.value = trackerTimeInitialized;
            trackerTime = trackerTimeInitialized;
            outputCurrentVideoSpeed.innerHTML = "Video Speed: 1x";
            break;
    }
}

// Function loads the video from the opened dialog file box.
function openVideo() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        myVideo.src = fileLocation + e.target.files[0].name;
    }
    input.click();
}

// Function handles click events for the buttons above the video player
function vidAction(event) {
    switch (event.target.id) {
        case "btnVideoPlay":
            myVideo.play();
            break;
        case "btnVideoPause":
            myVideo.pause();
            break;
        case "btnVideoStop":
            myVideo.pause();
            myVideo.currentTime = 0;
            myVideo.playbackRate = 1.0;
            outputCurrentVideoSpeed.innerHTML = "Video Speed: 1x";
            break;
        case "btnVideoBackwards":
            myVideo.currentTime -= 10;
            break;
        case "btnVideoForwards":
            myVideo.currentTime += 10;
            break;
        case "btnVideoFastBackwards":
            myVideo.playbackRate /= 2;
            outputCurrentVideoSpeed.innerHTML = "Video Speed: " + myVideo.playbackRate + 'x';
            break;
        case "btnVideoFastForwards":
            myVideo.playbackRate *= 2;
            outputCurrentVideoSpeed.innerHTML = "Video Speed: " + myVideo.playbackRate + 'x';
            break;
    }
}
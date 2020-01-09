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
const btnTrackerPlay = document.getElementById('btnTrackerPlay');
const btnTrackerPause = document.getElementById('btnTrackerPause');
const btnTrackerStop = document.getElementById('btnTrackerStop');

// Add event listeners for each of the video buttons
btnVideoPlay.addEventListener('click',vidAction); // On click, trigger a corresponding function
btnVideoPause.addEventListener('click',vidAction); 
btnVideoStop.addEventListener('click',vidAction); 
btnVideoBackwards.addEventListener('click',vidAction);
btnVideoForwards.addEventListener('click',vidAction);
btnVideoFastBackwards.addEventListener('click',vidAction);
btnVideoFastForwards.addEventListener('click',vidAction);
btnAddVideo.addEventListener('click',openVideo);

const fileLocation = 'Videos/';

function openVideo(event){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        myVideo.src = fileLocation + e.target.files[0].name;
        console.log(e.target.files[0]);
    }
    input.click();
}

function vidAction(event){
    switch(event.target.id){
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
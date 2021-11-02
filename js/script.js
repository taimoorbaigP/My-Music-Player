// all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music"),
muteBtn = wrapper.querySelector(".volume"),
hideMusicBtn = musicList.querySelector("#close");
let recent_volume= document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
//load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length)+1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); // calling load music function once window loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic(){
//here we'll just increment of index by 1
musicIndex++;
// if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
musicIndex > allMusic.length ? musicIndex = 1: musicIndex = musicIndex;
loadMusic(musicIndex);
playMusic ();
playingNow();
}

//prev music function
function prevMusic(){
    //here we'll just decrement of index by 1
    musicIndex--;
    // if musicIndex is less than 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length: musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic ();
    playingNow();
    }

// play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); //calling next music function
});

//prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic (); //calling next music function
});

// Change volume
 function volume_change(){
	volume_show.innerHTML = recent_volume.value;
	mainAudio.volume = recent_volume.value / 100;
} 

//unmute sound function
function unmute_sound(){
    mainAudio.volume = 15;
	volume.value = 15;
	volume_show.innerHTML = 15;
    muteBtn.querySelector("i").innerText = "volume_up"
}

//mute sound function
function mute_sound(){
	mainAudio.volume = 0;
	volume.value = 0;
	volume_show.innerHTML = 0;
    muteBtn.querySelector("i").innerText = "volume_off";
    (mainAudio.volume == 0) ? mute_sound : unmute_sound;
}


//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; // getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding e if sec is less than 10
            totalSec = `0${totalSec}`;
        }
            musicDuration.innerText = `${totalMin}:${totalSec}`;
        });
        //update playing song current time
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){ //adding e if sec is less than 10
            currentSec = `0${currentSec}`;
        };
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX; // getting offset X value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    /* playMusic(); // if music is paused and user click on the progress bar then music will play */
});

// repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    //first get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    // do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": // if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": // if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

/*above we changed the icon, now let's work on what to do after the
song ends */

mainAudio.addEventListener("ended", ()=>{
    /*we'll do according to the icon means if user has set icon to loop song then we'll repeat
    the current song and will do further accordingly*/

    let getText = repeatBtn.innerText; //getting innerText of icon
    // do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then we call the nextMusic function so that next song will play
            nextMusic();
            break;
        case "repeat_one": // if icon is repeat_one then change the current playing song current time to 0 so song will play from beginning
            mainAudio.currentMin = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": // if icon is shuffle then change it to repeat
            //generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length)+1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length)+1);
            }while(musicIndex == randIndex); //this loop run until the next random number won't be same as current music index
            musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); //calling loadMusic funcion
            playMusic(); //calling playMusic function
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//create li according to the array length
for(let i = 0; i < allMusic.length; i++){
    //pass the song name, artist fromthe array to li
    let liTag = `<li li-index="${i + 1}">
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration"></span>
</li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding e if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}


// play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j=0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")
        //remove playing class from all other li except the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //get audio duration value and pass to .audio-duration innertext
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
        }
        //if there is an li tag which li-index is equal to musicIndex
        //then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

//play song on li click
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liIndex to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
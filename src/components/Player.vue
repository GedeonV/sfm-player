<template>
  <div>
    <ul>
      <li v-for="item in songsList" :key="item._id">
        {{ item.fullname }} {{ item.song }}
        <hr />
      </li>
    </ul>

    <audio ref="audioPlayer">
      <source :src="currentSong" type="audio/mpeg" />
    </audio>
    <div class="container">
      <div class="box"></div>
      <button v-if="!isPlaying" @click="togglePausePlay()">Play</button>
      <button v-else @click="togglePausePlay()">Pause</button>
      <button @click="nextMusic()">Next</button>
      <button @click="prevMusic()">Previous</button>
      <div class="song-artist">{{currentArtist}}</div>
      <div class="song-title">{{currentSongTitle}}</div>
      <input
        type="range"
        id="progress-bar"
        min="0"
        max="100"
        v-model="value"
        @change="changeProgressBar()"
      />
      <div class="currentTime">{{ currentTime }}</div>
      <div class="durationTime">{{durationTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: {},
      users: [],
      songsList: [],
      fullname: "",
      isPlaying: false,
      currentSong: "",
      currentSongTitle: "",
      currentArtist: "",
      musicIndex: 0,
      value: 0,
      updateTimer: "",
      currentTime: "00:00",
      durationTime: "00:00",
    };
  },
  methods: {
    resetTime() {
      this.currentTime = "00:00";
      this.durationTime = "00:00";
      this.value = 0;
    },

    changeProgressBar() {
      let prog = this.$refs.audioPlayer.duration * (this.value / 100);
      this.$refs.audioPlayer.currentTime = prog;
    },

    changeProgressBarUpdate() {
      let barPosition = 0;
      if (!isNaN(this.$refs.audioPlayer.duration)) {
        barPosition =
          this.$refs.audioPlayer.currentTime *
          (100 / this.$refs.audioPlayer.duration);
        this.value = barPosition;

        let currentMinutes = Math.floor(
          this.$refs.audioPlayer.currentTime / 60
        );
        let currentSeconds = Math.floor(
          this.$refs.audioPlayer.currentTime - currentMinutes * 60
        );
        let durationMinutes = Math.floor(this.$refs.audioPlayer.duration / 60);
        let durationSeconds = Math.floor(
          this.$refs.audioPlayer.duration - durationMinutes * 60
        );

        if (currentSeconds < 10) {
          currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
          durationSeconds = "0" + durationSeconds;
        }
        if (currentMinutes < 10) {
          currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
          durationMinutes = "0" + durationMinutes;
        }

        this.currentTime = currentMinutes + ":" + currentSeconds;
        this.durationTime = durationMinutes + ":" + durationSeconds;
      }
    },

    loadMusic(index) {
      clearInterval(this.updateTimer);
      this.resetTime;
      this.currentSong = this.songsList[index].song.path;
      this.currentSongTitle = this.songsList[index].song.title;
      this.currentArtist = this.songsList[index].song.artist;
      this.$refs.audioPlayer.load();
      console.log(this.currentSong);
      this.updateTimer = setInterval(this.changeProgressBarUpdate, 1000);
      this.$refs.audioPlayer.addEventListener("ended", this.nextMusic);
    },

    togglePausePlay() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.playMusic();
      } else {
        this.isPlaying = false;
        this.pauseMusic();
      }
    },

    playMusic() {
      this.$refs.audioPlayer.play();
    },
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },

    nextMusic() {
      if (this.musicIndex < this.songsList.length - 1) this.musicIndex += 1;
      else this.musicIndex = 0;
      this.loadMusic(this.musicIndex);
      this.playMusic();
    },

    prevMusic() {
      if (this.musicIndex > 0) this.musicIndex -= 1;
      else this.musicIndex = this.songsList.length - 1;
      this.loadMusic(this.musicIndex);
      this.playMusic();
    },

    shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    },
    loadMusicList() {
      axios
        .get("parties/event/" + this.$route.params.id)
        .then((response) => {
          console.log(response.data);
          this.event = response.data;
          this.users = response.data.users;
          this.users.forEach((element) => {
            this.fullname = element.first_name + " " + element.last_name;
            console.log(this.fullname);
            element.songs.forEach((item) => {
              console.log(this.fullname + " " + item);
              this.songsList.push({
                fullname: this.fullname,
                song: item,
              });
            });
          });
          this.loadMusic(this.musicIndex);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.loadMusicList();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

#background {
  position: absolute;
  height: 100%;
  width: 100%;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(10px);
  z-index: -1;
}

/* container for music player */
.container {
  position: absolute;
  height: 300pt;
  width: 250pt;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  border-radius: 10px;
  box-shadow: 0 0 10px #000000;
}

/* container for play, pause, previous track, next track, and progress bar  */
.box {
  position: absolute;
  height: 50%;
  width: 103%;
  background: -webkit-linear-gradient(
    45deg,
    rgb(40, 40, 40),
    rgb(133, 133, 133)
  );
  z-index: 4;
  bottom: -17%;
}

/* track artist */
.song-artist {
  position: absolute;
  z-index: 4;
  color: rgb(193, 255, 6);
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-size: 20px;
  bottom: 21%;
  left: 28%;
}

/* track title */
.song-title {
  position: absolute;
  z-index: 4;
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: 17px;
  bottom: 16%;
  left: 28%;
}

/* style for current time of the track */
.currentTime {
  position: absolute;
  height: 50px;
  width: 50px;
  cursor: pointer;
  bottom: -7.5%;
  left: 17%;
  z-index: 4;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  color: white;
  align-items: center;
}

/* style for the total length of the track */
.durationTime {
  position: absolute;
  height: 50px;
  width: 50px;
  cursor: pointer;
  bottom: -1%;
  right: 11%;
  z-index: 4;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  align-items: center;
  color: rgb(193, 255, 6);
}

/* style for the progress bar */
#progress-bar {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  z-index: 4;
  height: 5px;
  background: #000000;
  width: 160pt;
  bottom: 5%;
  border-radius: 30px;
  left: 17%;
}

/* style for the progress bar's slider thumb */
#progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: -3px;
  margin-left: 0px;
  height: 10px;
  width: 7px;
  border: 0;
  background: -webkit-linear-gradient(
    45deg,
    rgb(213, 213, 213),
    rgb(193, 255, 6)
  );
  border-radius: 30px;
  cursor: pointer;
}

/* style for the progress bar's runnable track */
#progress-bar::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  max-height: 5px;
  border-radius: 30px;
}

/* style to remove blue shade of the progress bar when clicked on/selected */
#progress-bar:focus {
  outline: none;
}
</style>
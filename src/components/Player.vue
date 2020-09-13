<template>
  <div>
    <!-- //======= Balise audio =======// -->

    <audio crossorigin="anonymous" ref="audioPlayer">
      <source :src="currentSong" type="audio/mpeg" />
    </audio>

    <!-- //======= Player=======// -->

    <div class="container">
      <div class="box">
        <div class="audioVisual">
          <av-circle
            :outline-width="1"
            outline-color="#6477b7"
            :progress-width="6"
            progress-color="#eff0eb"
            :outline-meter-space="5"
            :canv-width="300"
            :canv-height="300"
            :canv-top="true"
            canv-class="audioCircle"
            ref-link="audioPlayer"
            :playtime="true"
            playtime-font="32px helvetica"
            playtime-color="#eff0eb"
          ></av-circle>
          <div v-if="cptActive">
            <p class="has-text-white">
              <span class="countdown">{{cpt}}</span> secondes
            </p>
            <p class="has-text-white">avant le prochain participant</p>
          </div>
        </div>

        <div v-if="!loading" class="audioInfo">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title has-text-success">Chansons actuelle :</p>
            </header>
            <div class="card-content">
              <div class="song-artist">{{ currentArtist }}</div>
              <div class="song-title">{{ currentSongTitle }}</div>
              <div>Chanté(e) par :</div>
              <div
                class="song-singer"
                v-if="this.songsList[this.musicIndex] !== undefined"
              >{{ this.songsList[this.musicIndex].fullname }}</div>
            </div>
          </div>
        </div>

        <div v-if="!loading && this.songsList[this.musicIndex + 1] !== undefined" class="nextAudio">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title has-text-primary">Prochaine chansons :</p>
            </header>
            <div class="card-content">
              <div class="song-artist">{{ nextArtist }}</div>
              <div class="song-title">{{ nextSongTitle }}</div>
              <div>Chanté(e) par :</div>
              <div
                class="song-singer"
                v-if="this.songsList[this.musicIndex + 1] !== undefined"
              >{{ this.songsList[this.musicIndex + 1].fullname }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="audioControl">
        <a @click="prevMusic()">
          <i class="fas fa-backward"></i>
        </a>
        <span v-if="!isPlaying">
          <a @click="togglePausePlay()">
            <i class="fas fa-play-circle"></i>
          </a>
        </span>

        <a v-if="isPlaying" @click="togglePausePlay()">
          <i class="fas fa-pause-circle"></i>
        </a>

        <a @click="nextMusic()">
          <i class="fas fa-forward"></i>
        </a>

        <div class="progressBar">
          <div class="range-slider">
            <input
              type="range"
              class="rs-range"
              min="0"
              max="100"
              v-model="value"
              @change="changeProgressBar()"
            />
          </div>

          <div class="box-minmax">
            <span>{{ currentTime }}</span>
            <span>{{ durationTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- //======= Modal =======// -->

    <div class="modal" v-bind:class="{ 'is-active': isActiveEvent }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <article class="message is-success">
          <div class="message-header">
            <p>Evènement terminé</p>
            <button class="delete" @click="closeModal()" aria-label="delete"></button>
          </div>
          <div class="message-body">Merci à tous d'avoir participé(e) !</div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //=========Variables Evènements==========//
      event: {},
      users: [],
      //=========Variables Player==========//
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
      nextSong: "",
      nextSongTitle: "",
      nextArtist: "",
      currentArtist: "",
      //=========Variables Etat==========//
      loading: false,
      isActiveEvent: false,
      //=========Variables Compte à rebours==========//
      cpt: 60,
      cptActive: false,
    };
  },
  methods: {
    closeModal() {
      this.isActiveEvent = false;
    },
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

      if (this.songsList[index + 1] !== undefined) {
        this.nextSong = this.songsList[index + 1].song.path;
        this.nextSongTitle = this.songsList[index + 1].song.title;
        this.nextArtist = this.songsList[index + 1].song.artist;
      }

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
      this.$store.commit("music", {
        event: this.$route.params.id,
        index: this.musicIndex,
      });
      this.$refs.audioPlayer.play();
      if (this.musicIndex == 0) {
        axios
          .put("/parties/event/" + this.$route.params.id + "/state", {
            state: 1,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },

    nextMusic() {
      if (this.musicIndex < this.songsList.length - 1) {
        let countdown = setInterval(() => {
          this.cptActive = true;
          --this.cpt;
          if (this.cpt == 0) {
            this.musicIndex += 1;
            this.loadMusic(this.musicIndex);
            this.isPlaying = true;
            clearInterval(countdown);
            this.cpt = 60;
            this.cptActive = false;
            this.playMusic();
          }
        }, 1000);
      } else {
        this.isActiveEvent = true;
        axios
          .put("/parties/event/" + this.$route.params.id + "/state", {
            state: 2,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    prevMusic() {
      if (this.musicIndex > 0) this.musicIndex -= 1;
      else this.musicIndex = this.songsList.length - 1;
      this.loadMusic(this.musicIndex);
      this.isPlaying = true;
      this.playMusic();
    },

    shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    },

    loadMusicList() {
      this.loading = true;
      axios
        .get("parties/event/" + this.$route.params.id)
        .then((response) => {
          console.log(response.data);
          this.event = response.data.event;
          this.users = response.data.event.users;
          this.users.forEach((element) => {
            console.log(element);
            this.fullname = element.first_name + " " + element.last_name;
            console.log("ICI");
            element.songs.forEach((item) => {
              if (item._id == this.$route.params.id) {
                console.log(this.fullname + " " + item.song);
                this.songsList.push({
                  fullname: this.fullname,
                  song: item.song,
                });
              }
            });
          });
          this.loadMusic(this.musicIndex);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeDestroy() {
    clearInterval(this.updateTimer);
  },
  watch: {
    $route(to, from) {
      clearInterval(this.updateTimer);
    },
  },
  mounted() {
    this.loadMusicList();
    if (this.$store.state.lastMusic.event == this.$route.params.id) {
      this.musicIndex = this.$store.state.lastMusic.index;
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
@import "../assets/scss/style.scss";

div.container {
  background: $grey-dark;
  margin-top: 30vh; /* poussé de la moitié de hauteur de viewport */
  transform: translateY(-30%); /* tiré de la moitié de sa propre hauteur */
  height: 700px;
  border-radius: 10px;
  position: relative;
}

article.message {
  width: 620px;
  height: 200px;

  & div.message-body {
    font-size: 26pt;
  }
}

div.box {
  height: 75%;
  background-color: $grey-lighter;
  border-radius: 10px 10px 0px 0px;
}

div.card {
  border-radius: 1em;
  width: 300px;

  & header p.card-header-title {
    font-size: 14pt;
  }
}

div.card-content {
  margin: 0;
}
div.audioVisual {
  margin-top: 5em;
  margin-right: 40%;
}

div.audioInfo {
  position: absolute;
  top: 10%;
  right: 10%;
  color: $beige-lighter;
}

div.nextAudio {
  position: absolute;
  top: 40%;
  right: 10%;
  color: $beige-lighter;
}

div.audioControl {
  a {
    color: $beige-lighter;
    font-size: 32pt;
    margin-right: 0.5em;
  }

  a:hover {
    color: $primary;
  }
}

div.progressBar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

div.box-minmax {
  margin-top: 0.8em;
  width: 608px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #ffffff;
  span:first-child {
    margin-left: 10px;
  }
}

.range-slider {
  margin-top: -0.5em;
}

input.rs-range {
  &::-moz-range-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    box-shadow: none;
    background: #ffffff;
    border-radius: 0px;
    border: 0px solid #010101;
  }

  &::-moz-range-progress {
    width: 100%;
    height: 1px;
    cursor: pointer;
    box-shadow: none;
    background: #ffffff;
    border-radius: 0px;
    border: 0px solid #010101;
  }

  &::-moz-range-thumb {
    box-shadow: none;
    border: 0px solid #ffffff;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
    height: 42px;
    width: 22px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -20px;
  }

  &::-moz-range-thumb:active {
    border: 0px solid $primary;
    background: $primary;
  }

  &::-moz-range-thumb:hover {
    border: 0px solid $primary;
    background: $primary;
  }

  &::-moz-focus-outer {
    border: 0;
  }
}

input.rs-range {
  margin-top: 1em;
  width: 600px;
  -webkit-appearance: none;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    box-shadow: none;
    background: #ffffff;
    border-radius: 0px;
    border: 0px solid #010101;
  }

  &::-webkit-slider-thumb {
    box-shadow: none;
    border: 0px solid #ffffff;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
    height: 42px;
    width: 22px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -20px;
  }

  &::-webkit-slider-thumb:hover {
    border: 0px solid $primary;
    background: $primary;
  }
}

span.countdown {
  font-size: 32pt;
}

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
</style>

// 69ba4c4276222937c90ca1f0398163b7 //

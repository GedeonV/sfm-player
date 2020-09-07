<template>
  <div>
    <ul>
      <li v-for="item in songsList" :key="item._id">
        {{ item.fullname }} {{ item.song }}
        <hr />
      </li>
    </ul>
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
    };
  },
  methods: {
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

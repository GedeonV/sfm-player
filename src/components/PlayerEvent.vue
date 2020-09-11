<template>
  <div>
    <ul>
      <li v-for="item in this.events" :key="item._id">
        <div class="card grow">
          <header class="card-header">
            <p class="card-header-title">{{ item.event_name }}</p>
          </header>

          <div class="card-content">
            <p>{{ item.theme }}</p>
            <p>{{ getDate(item.date) }}</p>
            <p id="desc">{{ item.description }}</p>
            <p>{{ item.location }}</p>
            <p>
              Nombre d'inscrit:
              <span class="tag is-info">{{ item.users.length }}</span>
            </p>
            <p v-if="item.state === 1">
              <span class="tag is-success">Evènement commencé</span>
            </p>
            <p v-if="item.state === 0">
              <span class="tag is-link">Evènement non commencé</span>
            </p>
            <p v-if="item.state === 2">
              <span class="tag is-danger">Evènement terminé</span>
            </p>
          </div>
          <footer v-if="item.state !== 2">
            <router-link :to="{ name: 'player', params: { id: item._id } }">
              <button class="button is-primary">Accéder</button>
            </router-link>
          </footer>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      events: {},
      dateFR: "",
      interval: "",
    };
  },
  methods: {
    loadEvents() {
      axios
        .get("parties/")
        .then((response) => {
          this.events = response.data.events;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getDate(e) {
      let d = new Date(e.slice(0, 10));
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      let dateFR = d.toLocaleDateString("fr-FR", options);
      this.dateFR = dateFR;
      return this.dateFR;
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    $route(to, from) {
      clearInterval(this.interval);
    },
  },
  mounted() {
    this.loadEvents();
    this.interval = setInterval(() => {
      this.loadEvents();
    }, 20000);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/style.scss";

div ul {
  display: flex;
  flex-direction: columns;
  flex-wrap: wrap;
  margin: 0 4em;
}

div li {
  flex: 1 1 auto;
  margin-left: 1px;
}

div.card {
  border-radius: 1em;
  width: 400px;
  height: 400px;
  margin: auto;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

div.card:hover {
  background-color: $grey-lighter;
  &.grow {
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
}

div.card-content {
  margin: 0;
}

header p.card-header-title {
  font-size: 16pt;
}

p#desc {
  overflow-y: hidden;
  height: 75px;
}

p {
  margin: 5px;
}
</style>

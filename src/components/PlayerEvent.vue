<template>
  <div>
    <ul>
      <li v-for="item in this.events" :key="item._id">
        <router-link :to="{ name: 'player', params: { id: item._id } }">
          {{ item }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      events: {},
    };
  },
  methods: {
    loadEvents() {
      axios
        .get("parties/")
        .then((response) => {
          this.events = response.data.events;
          console.log(this.events);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.loadEvents();
  },
};
</script>

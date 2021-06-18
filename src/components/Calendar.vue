<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet height="700">
          <v-calendar
            :now="today"
            :value="today"
            color="primary"
            @click:day="toggleStatus"
          >
            <template v-slot:day="{ date }">
              <template v-if="history[date]">
                <v-icon large color="green darken-2">
                  mdi-check-decagram
                </v-icon>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    today: "2019-01-10",
    history: {
      "2019-01-09": true,
      "2019-01-08": true,
      "2019-01-07": false,
      "2019-01-06": true,
      "2019-01-05": false,
      "2019-01-04": false,
      "2019-01-03": true,
    },
    colors: ["#1867c0", "#fb8c00", "#000000"],
    category: ["Development", "Meetings", "Slacking"],
  }),
  methods: {
    toggleStatus({ date }) {
      this.history[date] = !this.history[date]
      console.log(this.history[date]);
    },
  },
};
</script>

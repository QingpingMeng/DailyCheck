<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn fab text small color="grey darken-2" @click="prevMonth">
              <v-icon large> mdi-chevron-left </v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
              outlined
              small
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-toolbar-title>
              {{ currentMonth }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn fab text small color="grey darken-2" @click="nextMonth">
              <v-icon large> mdi-chevron-right </v-icon>
            </v-btn>
          </v-toolbar>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet height="500">
          <v-calendar
            :value="startDate"
            :start="startDate"
            :end="endDate"
            color="primary"
            @click:day="showConfirm"
          >
            <template v-slot:day="{ date }">
              <div class="center">
                <transition name="zoom">
                  <template v-if="history[date]">
                    <v-icon large color="green darken-2">
                      mdi-check-decagram
                    </v-icon>
                  </template>
                </transition>
              </div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="confirm" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> 确定吗? </v-card-title>
        <v-card-text>
          {{ !!this.history[this.selectedDate] ? "取消" : "" }}打卡
          {{ this.selectedDate }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="
              confirm = false;
              selectedDate = '';
            "
          >
            取消
          </v-btn>

          <v-btn color="green darken-1" text @click="toggleHistory">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.center {
  text-align: center;
}

.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: zoom;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoom {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  100% {
    opacity: 1;
  }
}
</style>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";

export default {
  data: () => ({
    confirm: false,
    selectedDate: "",
  }),
  computed: mapState({
    // arrow functions can make the code very succinct!
    history: (state) => state.history,
    startDate: (state) => state.startDate,
    endDate: (state) => state.endDate,
    currentMonth: (state) => dayjs(state.startDate).format("MMM YYYY"),
  }),
  methods: {
    showConfirm({ date }) {
      this.selectedDate = date;
      this.confirm = true;
    },
    toggleHistory() {
      this.$store.dispatch("toggleHistory", { date: this.selectedDate });
      this.confirm = false;
    },
    setToday() {
      this.$store.dispatch("updateTimeRange", {
        startDate: dayjs().startOf("month").toDate(),
        endDate: dayjs().endOf("month").toDate(),
      });
    },
    prevMonth() {
      this.$store.dispatch("updateTimeRange", {
        startDate: dayjs(this.startDate)
          .subtract(1, "month")
          .startOf("month")
          .toDate(),
        endDate: dayjs(this.endDate)
          .subtract(1, "month")
          .endOf("month")
          .toDate(),
      });
    },
    nextMonth() {
      this.$store.dispatch("updateTimeRange", {
        startDate: dayjs(this.startDate)
          .add(1, "month")
          .startOf("month")
          .toDate(),
        endDate: dayjs(this.endDate).add(1, "month").endOf("month").toDate(),
      });
    },
  },
};
</script>

import Vue from "vue";
import Vuex from "vuex";
import dayjs from "dayjs";
import db from "./db.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    startDate: dayjs().startOf("month").toDate(),
    endDate: dayjs().endOf("month").toDate(),
    history: {},
  },
  mutations: {
    setHistoryValue(state, payload) {
      state.history = Object.assign({}, state.history, {
        [payload.date]: payload.value,
      });
    },
    setHistory(state, payload) {
      state.history = payload;
    },
    setTimeRange(state, payload) {
      state.startDate = payload.startDate;
      state.endDate = payload.endDate;
    },
  },
  actions: {
    async toggleHistory(context, { date }) {
      var newVal = !context.state.history[date];
      await db.setHistory({
        date: dayjs(date).toDate(),
        checked: newVal,
      });
      context.commit("setHistoryValue", {
        date,
        value: newVal,
      });
    },
    async loadHistory({ state, commit }) {
      const historyArray = await db.getHistory(
        dayjs(state.startDate).subtract(7, "day").toDate(),
        dayjs(state.endDate).add(7, "day").toDate()
      );
      const history = historyArray.reduce(
        (acc, curr) => (
          (acc[dayjs(curr.date).format("YYYY-MM-DD")] = curr.checked), acc
        ),
        {}
      );
      commit("setHistory", history);
    },
    async updateTimeRange({ commit, dispatch }, payload) {
      commit("setTimeRange", payload);
      await dispatch("loadHistory");
    },
  },
  modules: {},
});

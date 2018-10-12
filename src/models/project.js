import { queryProjectNotice } from '@/services/api';

export default {
  namespace: 'project',

  state: {
    notice: [],
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      const { data } = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(data) ? data : [],
      });
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};

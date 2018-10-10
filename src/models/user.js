import { query as queryUsers, queryCurrent, updateUser, updateSecurity } from '@/services/user';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const { data } = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
    },
    *update({ payload }, { call, put, select }) {
      const { currentUser } = yield select(state => state.user);
      const user = {
        ...currentUser,
        ...payload,
      };
      const { success } = yield call(updateUser, user);
      if (success) {
        message.success('信息更新成功');
        yield put({ type: 'fetchCurrent' });
      }
    },
    *updateSecurity({ payload }, { call, put }) {
      const { success } = yield call(updateSecurity, payload);
      if (success) {
        message.success('信息更新成功');
        yield put({ type: 'fetchCurrent' });
      }
      return success;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};

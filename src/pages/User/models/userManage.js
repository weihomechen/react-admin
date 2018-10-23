import { query, updateUser, updateUsers } from '@/services/user';
import { message } from 'antd';

export default {
  namespace: 'userManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getUsers({ payload }, { call, put }) {
      const { data } = yield call(query, payload);
      yield put({
        type: 'stateChange',
        payload: { data },
      });
    },
    *update({ payload }, { call, put }) {
      const { success } = yield call(updateUser, payload);

      if (success) message.success('操作成功', 2);

      yield put({
        type: 'getUsers',
      });
    },
    *updateByBatch({ payload }, { call, put }) {
      const { success } = yield call(updateUsers, payload);

      if (success) message.success('操作成功', 2);

      yield put({
        type: 'getUsers',
      });
    },
  },

  reducers: {
    stateChange(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

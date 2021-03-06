import { register, getCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { success } = yield call(register, payload);
      if (success) {
        message.success('注册成功，请重新登录');
        yield put(routerRedux.push('/user/login'));
      }
    },
    *getCaptcha({ payload }, { call }) {
      const { mobile } = payload;

      const { success } = yield call(getCaptcha, mobile);
      return success;
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

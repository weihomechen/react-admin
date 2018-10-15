import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/admin/api/project/notice');
}

export async function queryActivities() {
  return request('/admin/api/activities');
}

export async function queryRule(params) {
  return request(`/admin/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/admin/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/admin/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/admin/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/admin/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fetchChartData() {
  return request('/admin/api/chart/list');
}

export async function queryTags() {
  return request('/admin/api/tags/list');
}

export async function queryBasicProfile() {
  return request('/admin/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/admin/api/profile/advanced');
}

export async function queryProjectList(params) {
  return request(`/admin/api/project/list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/admin/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/admin/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/admin/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function login(params) {
  return request('/admin/api/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/admin/api/user/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/admin/api/notices');
}

export async function getCaptcha(mobile) {
  return request(`/admin/api/captcha?mobile=${mobile}`);
}

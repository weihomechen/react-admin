import request from '@/utils/request';
import { stringify } from 'qs';

const method = 'POST';

export async function query(params) {
  return request(`/admin/api/user/list?${stringify(params)}`);
}

export async function queryCurrent() {
  return request('/admin/api/user/current');
}

export async function updateUser(body) {
  return request('/admin/api/user/update', { method, body });
}

export async function updateUsers(body) {
  return request('/admin/api/user/updateUsers', { method, body });
}

export async function updateSecurity(body) {
  return request('/admin/api/user/updateSecurity', { method, body });
}

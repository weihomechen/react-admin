import request from '@/utils/request';

const method = 'POST';

export async function query() {
  return request('/admin/api/users');
}

export async function queryCurrent() {
  return request('/admin/api/user/current');
}

export async function updateUser(body) {
  return request('/admin/api/user/update', { method, body });
}

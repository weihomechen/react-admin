import request from '@/utils/request';

export async function query() {
  return request('/admin/api/users');
}

export async function queryCurrent() {
  return request('/admin/api/currentUser');
}

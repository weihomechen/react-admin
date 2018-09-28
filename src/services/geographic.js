import request from '@/utils/request';

export async function queryProvince() {
  return request('/admin/api/geographic/province');
}

export async function queryCity(province) {
  return request(`/admin/api/geographic/city/${province}`);
}

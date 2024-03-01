import { request } from '../request';

/**
 * 获取借阅数据
 * @returns 借阅数据列表
 */
export function getBorrowPage(params: PageParam) {
  return request.get<any>('/system/borrow/page', { params });
}

/**
 * 更新借阅状态
 *
 */
export function updateBorrowStatus(id: number, status: number) {
  return request.put<any>(`/system/borrow/update?id=${id}&status=${status}`);
}

/**
 *
 * 自动审批
 * @returns
 */
export function autoApproveBorrowBook() {
  return request.get<any>('/system/borrow/autoApprove');
}

/**
 * 审批通过
 */
export function approveBorrowBook(serialNumber: string, remark: string) {
  return request.put<any>(`/system/borrow/approve?serialNumber=${serialNumber}&remark=${remark}`);
}

/**
 * 审批驳回
 */
export function refuseBorrowBook(serialNumber: string, remark: string) {
  return request.put<any>(`/system/borrow/refuse?serialNumber=${serialNumber}&remark=${remark}`);
}

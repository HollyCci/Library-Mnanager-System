import dayjs from 'dayjs';

/**
 * 格式化日期并返回字符串表示。
 * @param date 要格式化的日期对象。
 * @param format 可选的日期格式字符串。如果未提供，默认为 'YYYY-MM-DD HH:mm:ss'。
 * @returns 格式化后的日期字符串。
 */
export function formatDate(date: Date, format?: string): string {
  // 日期不存在，返回空字符串
  if (!date) {
    return '';
  }

  // 如果未提供格式，则使用默认格式
  const usedFormat = format || 'YYYY-MM-DD HH:mm:ss';

  // 使用 dayjs 库格式化日期并返回结果
  return dayjs(date).format(usedFormat);
}

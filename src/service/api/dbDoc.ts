import { request } from '../request';

/**
 * 获取HTML格式的数据库文档
 * @returns HTML文件二进制流
 */
export function exportHtml() {
  return request.download('/infra/db-doc/export-html');
}

/**
 * 获取Word格式的数据库文档
 * @returns Word文件二进制流
 */
export function exportWord() {
  return request.download('/infra/db-doc/export-word');
}

/**
 * 获取Markdown格式的数据库文档
 * @returns Markdown文件二进制流
 */
export function exportMarkdown() {
  return request.download('/infra/db-doc/export-markdown');
}

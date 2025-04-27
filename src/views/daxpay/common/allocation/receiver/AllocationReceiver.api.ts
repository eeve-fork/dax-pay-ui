import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AllocReceiver>>>({
    url: '/allocation/receiver/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<AllocReceiver>>({
    url: '/allocation/receiver/findById',
    params: { id },
  })
}

/**
 * 获取可以分账的通道
 */
export function findChannels() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/allocation/receiver/findChannels',
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result<void>>({
    url: '/allocation/receiver/delete',
    params: { id },
  })
}

/**
 * 分账接收方
 */
export interface AllocReceiver extends MchEntity {
  // 分账接收方编号
  receiverNo?: string
  // 名称
  receiverName?: string
  // 所属通道
  channel?: string
  // 分账接收方类型
  receiverType?: string
  // 接收方账号
  receiverAccount?: string
}

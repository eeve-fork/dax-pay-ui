import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 详情
 * @param id
 */
export function get(id) {
  return defHttp.get<Result<AlipayAllocReceiver>>({
    url: '/alipay/allocation/receiver/findById',
    params: { id },
  })
}
/**
 * 新增或更新
 */
export function saveOrUpdate(data) {
  return defHttp.post<Result<void>>({
    url: '/alipay/allocation/receiver/saveOrUpdate',
    data,
  })
}

/**
 * 支付宝分账接收方
 */
export interface AlipayAllocReceiver extends MchEntity {
  // 分账接收方编号
  receiverNo?: string
  // 接收方名称
  receiverName?: string
  // 接收方类型
  receiverType?: string
  // 接收方账号
  receiverAccount?: string
  // 分账关系类型
  relationType?: string
  // 分账关系名称
  relationName?: string
}

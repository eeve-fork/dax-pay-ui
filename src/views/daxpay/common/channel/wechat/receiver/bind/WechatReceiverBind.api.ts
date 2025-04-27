import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 分页查询
 */
export function page(params) {
  return defHttp.get<Result<PageResult<WechatReceiverBind>>>({
    url: '/wechat/allocation/receiver/bind/page',
    params,
  })
}

/**
 * 查询
 */
export function get(id) {
  return defHttp.get<Result<WechatReceiverBind>>({
    url: '/wechat/allocation/receiver/bind/findById',
    params: { id },
  })
}
/**
 * 创建
 */
export function add(data) {
  return defHttp.post<Result<void>>({
    url: '/wechat/allocation/receiver/bind/add',
    data,
  })
}
/**
 * 更新
 */
export function update(data) {
  return defHttp.post<Result<void>>({
    url: '/wechat/allocation/receiver/bind/update',
    data,
  })
}

/**
 * 绑定
 */
export function bind(id) {
  return defHttp.post<Result<void>>({
    url: '/wechat/allocation/receiver/bind/bind',
    params: { id },
  })
}

/**
 * 解绑
 */
export function unbind(id) {
  return defHttp.post<Result<void>>({
    url: '/wechat/allocation/receiver/bind/unbind',
    params: { id },
  })
}
/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result<WechatReceiverBind>>({
    url: '/wechat/allocation/receiver/bind/remove',
    params: { id },
  })
}

/**
 * 支付宝分账接收方绑定
 */
export interface WechatReceiverBind extends MchEntity {
  // 接收方类型
  receiverType?: string
  // receiverAccount
  receiverAccount?: string
  // 接收方名称
  receiverName?: string
  // 分账关系类型
  relationType?: string
  // 分账关系名称
  relationName?: string
  // 是否服务商模式
  isv?: boolean
  // 是否绑定
  bind?: boolean
  // 错误提示
  errorMsg?: string
}

import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 查询收款码牌列表
 */
export function getCodeCardList(appId) {
  return defHttp.get<Result<CodeCardConfig[]>>({
    url: '/cashier/code/config/findAllByAppId',
    params: { appId },
  })
}

/**
 * 查询收款码牌列表(根据Id)
 */
export function getCodeCardListById(id) {
  return defHttp.get<Result<CodeCardConfig>>({
    url: '/cashier/code/config/findById',
    params: {
      id,
    },
  })
}

/**
 * 新增收款码牌
 */
export function saveCodeCardConfig(data: CodeCardConfig) {
  return defHttp.post<Result<CodeCardConfig>>({
    url: '/cashier/code/config/save',
    data,
  })
}

/**
 * 编辑收款码牌
 */
export function editCodeCardConfig(data: CodeCardConfig) {
  return defHttp.post<Result<CodeCardConfig>>({
    url: '/cashier/code/config/update',
    data,
  })
}

/**
 * 删除收款码牌
 */
export function delCodeCardConfig(id) {
  return defHttp.post({
    url: '/cashier/code/config/delete',
    params: { id },
  })
}

/**
 * 查询收款码牌类型配置列表
 */
export function getCodeCardTypeList(codeId) {
  return defHttp.get<Result<CodeCardConfigType[]>>({
    url: '/cashier/code/config/item/findAll',
    params: { codeId },
  })
}

/**
 * 查询收款码牌类型配置列表(根据Id)
 */
export function getCodeCardTypeListById(id) {
  return defHttp.get<Result<CodeCardConfigType>>({
    url: '/cashier/code/config/item/findById',
    params: {
      id,
    },
  })
}

/**
 * 新增收款码牌类型配置
 */
export function saveCodeCardTypeConfig(data: CodeCardConfigType) {
  return defHttp.post<Result<CodeCardConfigType>>({
    url: '/cashier/code/config/item/save',
    data,
  })
}

/**
 * 编辑收款码牌类型配置
 */
export function editCodeCardTypeConfig(data: CodeCardConfigType) {
  return defHttp.post<Result<CodeCardConfigType>>({
    url: '/cashier/code/config/item/update',
    data,
  })
}

/**
 * 删除收款码牌类型配置
 */
export function delCodeCardTypeConfig(id) {
  return defHttp.post({
    url: '/cashier/code/config/item/delete',
    params: { id },
  })
}

/**
 * 聚合付款码支付配置是否存在
 */
export function existsCodeCardTypeConfig(codeId, type) {
  return defHttp.get<Result<boolean>>({
    url: '/cashier/code/config/item/exists',
    params: {
      codeId,
      type,
    },
  })
}

/**
 * 聚合付款码支付配置是否存在(不包含自身)
 */
export function existsCodeCardTypeConfigNotId(codeId, type, id) {
  return defHttp.get<Result<boolean>>({
    url: '/cashier/code/config/item/existsNotId',
    params: {
      codeId,
      type,
      id,
    },
  })
}

/**
 * 获取码牌
 */
export function getCodeCardUrl(id) {
  return defHttp.get({
    url: '/cashier/code/config/getCashierCodeUrl',
    params: { id },
  })
}

/**
 * 收款码牌配置
 */
export interface CodeCardConfig extends MchEntity {
  // 码牌名称
  name?: string
  // 码牌编号
  code?: string
  // 是否启用
  enable?: boolean
  // 需要获取OpenId
  needOpenId?: boolean
  // 分账
  allocation?: boolean
  // 自动分账
  autoAllocation?: boolean
  // 限制支付类型
  limitPay?: string
  // 备注
  remark?: string
  // 模板编号
  templateCode?: string
}

/**
 * 收款码牌类型配置
 */
export interface CodeCardConfigType extends MchEntity {
  // 码牌类型
  type?: string
  // 通道
  channel?: string
  // 码牌ID
  codeId?: string
  // 支付方式
  payMethod?: string
  // 其他支付方式
  otherMethod?: string
  // 需要获取OpenId
  needOpenId?: boolean
  // 发起调用的类型
  callType?: string
  // 备注
  remark?: string
}

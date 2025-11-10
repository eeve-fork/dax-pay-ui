import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取服务商创建代理商的默认权限配置
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<IsvDefaultPermConfig>>({
    url: '/isv/default/perm/config/findByIsvNo',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新服务商创建代理商的默认权限配置
 */
export function updateConfig(data: IsvDefaultPermConfig) {
  return defHttp.post<Result<IsvDefaultPermConfig>>({
    url: '/isv/default/perm/config/update',
    data,
  })
}

/**
 * 服务商创建代理商的默认权限配置
 */
export interface IsvDefaultPermConfig extends MchEntity {
  /** 是否可用代理商API接口 */
  agentApi?: boolean

  /** 是否可以查询商户订单信息(界面) */
  queryOrder?: boolean

  /** 是否可以代商户退款(界面) */
  refund?: boolean

  /** 是否可以创建商户订单(界面) */
  createOrder?: boolean

  /** 是否可以创建进件商户 */
  createOnbMch?: boolean

  /** 是否可以代商户进行交易(API) */
  tradeApi?: boolean

  /** 是否可以设置商户结算周期 */
  settleCycle?: boolean

  /** 是否可以操作商户应用 */
  setupMchApp?: boolean

  /** 是否可以查看商户应用信息 */
  mchAppInfo?: boolean

  /** 设置商户分账规则 */
  setupMchProfit?: boolean

  /** 可用通道 */
  availableChannel?: string[]

  /** 可用接口 */
  availableApi?: string[]
}

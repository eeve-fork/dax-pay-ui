import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 查询代理商权限
 */
export function getAgentPermConfig() {
  return defHttp.get<Result<AgentPermConfig>>({
    url: '/agent/perm/config/get',
  })
}

/**
 * 查询商户权限
 */
export function getMchPermConfig() {
  return defHttp.get<Result<MerchantPermConfig>>({
    url: '/merchant/perm/config/get',
  })
}

/**
 * 代理商权限配置类型
 */
export interface AgentPermConfig {
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

/**
 * 商户权限配置参数
 */
export interface MerchantPermConfig {
  /** 是否有API接口权限 */
  hasApi?: boolean
  /** 是否发起进件申请 */
  applyMch?: boolean
  /** 设置商户分账规则 */
  setupMchProfit?: boolean
}

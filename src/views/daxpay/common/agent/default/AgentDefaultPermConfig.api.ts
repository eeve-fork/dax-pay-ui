import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 根据代理商号查询
 */
export function getConfig(agentNo: string) {
  return defHttp.get<Result<AgentDefaultPermConfigResult>>({
    url: '/agent/default/perm/config/findByAgentNo',
    params: { agentNo },
  })
}

/**
 * 更新
 */
export function updateConfig(param: AgentDefaultPermConfigParam) {
  return defHttp.post({
    url: '/agent/default/perm/config/update',
    data: param,
  })
}

/**
 * API权限列表
 */
export function apiPermList(agentNo: string) {
  return defHttp.get<Result<ApiConstResult[]>>({
    url: '/agent/default/perm/config/apiPermList',
    params: { agentNo },
  })
}

/**
 * 通道权限列表
 */
export function channelPermList(agentNo: string) {
  return defHttp.get<Result<ChannelConstResult[]>>({
    url: '/agent/default/perm/config/channelPermList',
    params: { agentNo },
  })
}

/**
 * 代理商默认权限配置参数
 */
export interface AgentDefaultPermConfigParam {
  /** 代理商号 */
  agentNo: string
  /** 是否有API接口权限 */
  hasApi?: boolean
  /** 是否发起进件申请 */
  applyMch?: boolean
  /** 设置商户分账规则 */
  setupMchProfit?: boolean
  /** 可用通道 */
  availableChannel?: string[]
  /** 可用接口 */
  availableApi?: string[]
}

/**
 * 代理商默认权限配置结果
 */
export interface AgentDefaultPermConfigResult {
  /** 是否有API接口权限 */
  hasApi?: boolean
  /** 是否发起进件申请 */
  applyMch?: boolean
  /** 设置商户分账规则 */
  setupMchProfit?: boolean
  /** 可用通道 */
  availableChannel?: string[]
  /** 可用接口 */
  availableApi?: string[]
}

/**
 * API常量结果
 */
export interface ApiConstResult {
  name: string
  code: string
  api: string
}

/**
 * 通道常量结果
 */
export interface ChannelConstResult {
  label: string
  value: string
}

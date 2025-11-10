import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 查询配置(运营端)
 */
export function get(agentNo) {
  return defHttp.get<Result<AgentCredentialConfig>>({
    url: '/admin/agent/credential/findByAgent',
    params: { agentNo },
  })
}

/**
 * 更新配置(运营端)
 */
export function update(obj) {
  return defHttp.post<Result<void>>({
    url: '/admin/agent/credential/update',
    data: obj,
  })
}

/**
 * 查询配置(代理端)
 */
export function getAgent() {
  return defHttp.get<Result<AgentCredentialConfig>>({
    url: '/agent/credential/get',
  })
}

/**
 * 更新配置(代理端)
 */
export function updateAgent(obj) {
  return defHttp.post<Result<void>>({
    url: '/agent/credential/update',
    data: obj,
  })
}

/**
 * 代理商接口对接配置
 * @author xxm
 * @since 2025/8/21
 */
export interface AgentCredentialConfig extends MchEntity {
  /** 平台公钥 */
  platformPublicKey?: string
  /** 代理商公钥 */
  publicKey?: string
  /** 通信密钥 */
  secretKey?: string
}

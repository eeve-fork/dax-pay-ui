import { defineStore } from 'pinia'
import { AgentPermConfig, getMchPermConfig } from '@/api/daxpay/DaxpayPerm.api'

/**
 * 代理商权限
 */
interface AgentPernStore {
  perm: AgentPermConfig
}
export const useAgentPernStore = defineStore({
  id: 'agent-pern',
  state: (): AgentPernStore => ({
    perm: {} as AgentPermConfig,
  }),
  getters: {
    getAgentPerm(): AgentPermConfig {
      return this.perm
    },
  },
  actions: {
    initAgentPerm() {
      getMchPermConfig().then(({ data }) => {
        this.perm = data
      })
    },
  },
})

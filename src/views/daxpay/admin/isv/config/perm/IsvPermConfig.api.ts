import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取ISV权限配置
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<IsvPermConfig>>({
    url: '/isv/perm/config/findByIsvNo',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新ISV权限配置
 */
export function updateConfig(data: IsvPermConfig) {
  return defHttp.post<Result<IsvPermConfig>>({
    url: '/isv/perm/config/update',
    data,
  })
}

/**
 * ISV权限配置
 */
export interface IsvPermConfig extends MchEntity {
  /** 可用接口 */
  availableApi?: string[]
}

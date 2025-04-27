import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 查询通道报备列表
 */
export function list(params: any) {
  return defHttp.get<Result<ChannelTerminal[]>>({
    url: '/terminal/device/channel/list',
    params,
  })
}

/**
 * 通道报备
 */
export function submit(channelTerminalId) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/channel/submit',
    params: { channelTerminalId },
  })
}

/**
 * 通道报备取消
 */
export function cancel(channelTerminalId) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/channel/cancel',
    params: { channelTerminalId },
  })
}

/**
 * 通道报备修改
 */
export function update(data) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/channel/edit',
    data,
  })
}

/**
 * 查询通道报备详情
 */
export function get(channelTerminalId) {
  return defHttp.get<Result<ChannelTerminal>>({
    url: '/terminal/device/channel/detail',
    params: { channelTerminalId },
  })
}

/**
 * 通道报备新增
 */
export function add(params) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/channel/add',
    params,
  })
}

/**
 * 检查并修复终端设备
 */
export function checkAndRepair(terminalId) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/channel/checkAndRepair',
    params: { terminalId },
  })
}

/**
 * 通道终端设备上报记录
 */
export interface ChannelTerminal extends MchEntity {
  /** 终端设备ID */
  terminalId?: string

  /** 通道 */
  channel?: string

  /** 报送类型 */
  type?: string

  /** 状态 */
  status?: string

  /** 通道终端号 */
  outTerminalNo?: string

  /** 错误信息 */
  clearErrMsg?: boolean
}

import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页查询
 */
export function page(params: any) {
  return defHttp.get<Result<PageResult<TerminalDevice>>>({
    url: '/terminal/device/page',
    params,
  })
}

/**
 * 根据ID查询
 */
export function get(id: string) {
  return defHttp.get<Result<TerminalDevice>>({
    url: '/terminal/device/findById',
    params: { id },
  })
}

/**
 * 新增
 */
export function add(data: TerminalDevice) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/add',
    data,
  })
}

/**
 * 修改
 */
export function update(data: TerminalDevice) {
  return defHttp.post<Result<void>>({
    url: '/terminal/device/edit',
    data,
  })
}

/**
 * 删除
 */
export function remove(id: string) {
  return defHttp.delete<Result<void>>({
    url: '/terminal/device/delete',
    params: { id },
  })
}

/**
 * 根据AppId查询下拉列表
 */
export function dropdown(appId) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/terminal/device/dropdown',
    params: { appId },
  })
}

/**
 * 终端设备
 */
export interface TerminalDevice extends MchEntity {
  /** 终端名称 */
  name?: string

  /** 终端编码 */
  terminalNo?: string

  /** 终端类型 */
  type?: string

  /** 终端序列号 */
  serialNum?: string

  /** 省市区编码 */
  areaCode?: string[]

  /** 终端发放地址 */
  address?: string

  /** 终端厂商名称 */
  companyName?: string

  /** 发放日期 */
  putDate?: string

  /** 支持终端定位 */
  gps?: boolean

  /** 终端机具型号 */
  machineType?: string

  /** 经度，浮点型, 小数点后最多保留6位 */
  longitude?: string

  /** 纬度，浮点型,小数点后最多保留6位 */
  latitude?: string

  /** 设备 IP 地址 */
  ip?: string

  /** 银行卡受理终端产品入网认证编号 */
  networkLicense?: string
}

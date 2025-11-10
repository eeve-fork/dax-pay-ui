import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<Merchant>>>({
    url: '/admin/merchant/page',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<Merchant>>({
    url: '/admin/merchant/findById',
    params: { id },
  })
}
/**
 * 创建商户
 */
export const add = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/add',
    data: obj,
  })
}
/**
 * 更新商户
 */
export const update = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/update',
    data: obj,
  })
}

/**
 * 主体认证通过
 */
export function passProfileAuth(mchNo) {
  return defHttp.post<Result<void>>({
    url: '/merchant/status/passProfileAuth',
    params: { mchNo },
  })
}

/**
 * 主体认证拒绝
 */
export function rejectProfileAuth(mchNo, reason) {
  return defHttp.post<Result<void>>({
    url: '/merchant/status/rejectProfileAuth',
    params: { mchNo, reason },
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/delete',
    params: { id },
  })
}

/**
 * 注册
 */
export const register = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/user/register',
    data: obj,
  })
}

/**
 * 发送忘记密码验证码
 */
export const sendForgotCaptcha = (account: string, phone: string) => {
  return defHttp.post<Result<string>>({
    url: '/merchant/user/forgot/sendCaptcha',
    params: { account, phone },
  })
}

/**
 * 校验忘记密码验证码
 */
export const checkForgotCaptcha = (param: MerchantForgotParam) => {
  return defHttp.get<Result<void>>({
    url: '/merchant/user/forgot/checkCaptcha',
    params: param,
  })
}

/**
 * 修改密码
 */
export const forgotPassword = (param: MerchantForgotParam) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/user/forgot/changePwd',
    data: param,
  })
}

/**
 * 发送注册验证码
 */
export const sendRegisterCaptcha = (phone: string) => {
  return defHttp.post<Result<string>>({
    url: '/merchant/user/register/sendCaptcha',
    params: { phone },
  })
}

/**
 * 校验注册验证码
 */
export const checkRegisterCaptcha = (param: MerchantRegisterParam) => {
  return defHttp.get<Result<void>>({
    url: '/merchant/user/register/checkCaptcha',
    params: param,
  })
}

/**
 * 商户
 */
export interface Merchant extends BaseEntity {
  // 商户号
  mchNo?: string
  // 商户名称
  mchName?: string
  // 状态
  status?: string
  // 服务商
  isvNo?: string
  // 服务商名称
  isvName?: string
  // 代理商
  agentNo?: string
  // 代理商名称
  agentName?: string
  // 主体认证状态
  profileAuth?: string
  // 主体认证错误信息
  profileAuthErrorMsg?: string
}

/**
 * 商户创建参数
 */
export interface MerchantCreate {
  // 商户名称
  mchName?: string
  // 代理商
  agentNo?: string
  // 商户类型
  merchantType?: string
  // 创建默认应用
  createDefaultApp?: boolean
  // 状态
  status?: string
  // 管理员名称
  name?: string
  // 商户管理员账号
  account?: string
  // 商户管理员密码
  password?: string
  // 重复密码
  confirmPassword?: string
}

/**
 * 商户忘记密码参数
 */
export interface MerchantForgotParam {
  // 用户账号
  account?: string
  // 用户绑定手机号
  phone?: string
  // 新密码
  newPassword?: string
  // 验证码
  smsCaptcha?: string
}

/**
 * 商户注册参数
 */
export interface MerchantRegisterParam {
  // 商户名称
  mchName?: string
  // 管理员名称
  name?: string
  // 商户管理员账号
  account?: string
  // 商户管理员密码
  password?: string
  // 重复密码
  confirmPassword?: string
  // 用户绑定手机号
  phone?: string
  // 验证码
  smsCaptcha?: string
}

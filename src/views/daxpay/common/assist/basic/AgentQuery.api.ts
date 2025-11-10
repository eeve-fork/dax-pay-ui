import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 查询代理商下拉列表
 */
export function dropdown() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/agent/query/dropdown',
  })
}
/**
 * 查询启用的代理商下拉列表
 */
export function dropdownByEnable() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/agent/query/dropdownByEnable',
  })
}

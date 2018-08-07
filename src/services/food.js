import { request, config } from 'utils'

const { api } = config
const { food, fooddel } = api

export async function query (params) {
  return request({
    url: food,
    method: 'get',
    data: params,
  })
}
export async function create (params) {
  return request({
    url: food.replace('/:id'),
    method: 'post',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url: food,
    method: 'delete',
    data: params,
  })
}
export async function removesome (params) {
  return request({
    url: fooddel,
    method: 'delete',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: food,
    method: 'patch',
    data: params,
  })
}

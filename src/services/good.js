import { request, config } from 'utils'

const { api } = config
const { good, gooddel} = api

export async function query (params) {
  return request({
    url: good,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: good,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: good,
    method: 'delete',
    data: params,
  })
}

export async function removesome (params) {
  return request({
    url: gooddel,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: good,
    method: 'patch',
    data: params,
  })
}

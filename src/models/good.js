/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update, query, removesome} from 'services/good'
import * as usersService from 'services/users'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
    namespace: 'good',

    state: {
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        id: null,
        isMotion: window.localStorage.getItem(`${prefix}goodIsMotion`) === 'true',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/good') {
                    const payload = location.query || { current: 1, pageSize: 10 }
                    dispatch({
                        type: 'query',
                        payload,
                    })
                }
            })
        },
    },

    effects: {

        * query({ payload = {} }, { call, put }) {
            const data = yield call(query, payload)
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.data,
                        pagination: {
                            current: Number(payload.page) || 1,
                            pageSize: Number(payload.pageSize) || 10,
                            total: data.total,
                        },
                    },
                })
            }
        },

        * delete({ payload }, { call, put, select }) {
            const data = yield call(remove, { id: payload })
            const { selectedRowKeys } = yield select(_ => _.good)
            if (data.success) {
                yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * multiDelete({ payload }, { call, put }) {
            console.log(usersService);
            const data = yield call(removesome, payload)
            if (data.success) {
                yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * create({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * update({ payload }, { select, call, put }) {
            const id = yield select(({ good }) => good.currentItem.id)
            const newGood = { ...payload, id }
            const data = yield call(update, newGood)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

    },

    reducers: {

        showModal(state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal(state) {
            return { ...state, modalVisible: false }
        },

        switchIsMotion(state) {
            window.localStorage.setItem(`${prefix}goodIsMotion`, !state.isMotion)
            return { ...state, isMotion: !state.isMotion }
        },

    },
})

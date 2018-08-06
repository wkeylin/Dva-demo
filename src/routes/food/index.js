import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'

import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Food = ({ location, dispatch, food, loading }) => {
    location.query = queryString.parse(location.search)
    const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = food
    const { pageSize } = pagination;

    const modalProps = {
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['food/update'],
        title: `${modalType === 'create' ? 'Create Food' : 'Update Food'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
          dispatch({
            type: `food/${modalType}`,
            payload: data,
          })
        },
        onCancel () {
          dispatch({
            type: 'food/hideModal',
          })
        },
    }
    const filterProps = {
        isMotion,
        filter: {
          ...location.query,
        },
        onFilterChange (value) {
          dispatch(routerRedux.push({
            pathname: location.pathname,
            query: {
              ...value,
              page: 1,
              pageSize,
            },
          }))
        },
        onSearch (fieldsValue) {
          fieldsValue.keyword.length ? dispatch(routerRedux.push({
            pathname: '/food',
            query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
            },
          })) : dispatch(routerRedux.push({
            pathname: '/food',
          }))
        },
        onAdd () {
          dispatch({
            type: 'food/showModal',
            payload: {
              modalType: 'create',
            },
          })
        },
        switchIsMotion () {
          dispatch({ type: 'food/switchIsMotion' })
        },
      }
    const listProps = {
        dataSource: list,
        loading: loading.effects['food/query'],
        pagination,
        location,
        isMotion,
        onChange(page) {
            const { query, pathname } = location
            dispatch(routerRedux.push({
                pathname,
                query: {
                    ...query,
                    page: page.current,
                    pageSize: page.pageSize,
                },
            }))
        },
        onDeleteItem(id) {
            dispatch({
                type: 'food/delete',
                payload: id,
            })
        },
        onEditItem(item) {
            
            console.log(item);
            dispatch({
                type: 'food/showModal',
                payload: {
                    modalType: 'update',
                    currentItem: item,
                },
            })
        },
        rowSelection: {
            selectedRowKeys,
            onChange: (keys) => {
                dispatch({
                    type: 'food/updateState',
                    payload: {
                        selectedRowKeys: keys,
                    },
                })
            },
        },
    }
    const handleDeleteItems = () => {
        dispatch({
            type: 'food/multiDelete',
            payload: {
                ids: selectedRowKeys,
            },
        })
    }
    return (
        <Page inner>
            <Filter {...filterProps} />
            {
                selectedRowKeys.length > 0 &&
                <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
                <Col>
                    {`Selected ${selectedRowKeys.length} items `}
                    <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
                    <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
                    </Popconfirm>
                </Col>
                </Row>
            }
            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
        </Page>

    )
}

export default connect(({ food, loading}) => ({ food, loading}))(Food)
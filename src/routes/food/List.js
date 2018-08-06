import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm;

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) =>{
    location.query = queryString.parse(location.search);

    const handleMenueClick = (record, e) => {
        if(e.key === '1'){
            console.log(record);
            onEditItem(record);
        }else if(e.key === '2'){
            confirm({
                title: 'Are you sure delete this record?',
                onOk(){
                    onDeleteItem(record.id);
                },
            })
        }
    }
    const columns = [
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
        },{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '简写',
            dataIndex: 'abridge',
            key: 'abridge',
        },{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },{
            title: '规格',
            dataIndex: 'unit',
            key: 'unit',
        },{
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                return <DropOption onMenuClick={e => handleMenueClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
            },
        }
    ];
    const getBodyWrapperProps = {
        page: location.query.page,
        current: tableProps.pagination.current,
    }
    const getBodyWrapper = (body) => {
        return isMotion ? <AnimTableBody { ...getBodyWrapperProps} body = { body } /> : body
    }
    return (
        <div>
            <Table 
                { ...tableProps}
                className = {classnames({[styles.table]:true,[styles.motion]:isMotion})}
                bordered
                columns = {columns}
                simple
                rowKey = { record => record.id}
                getBodyWrapper = {getBodyWrapper}
            />
        </div>
    )
    List.propTypes = {
        onDeleteItem: PropTypes.func,
        onEditItem: PropTypes.func,
        isMotion: PropTypes.bool,
        location: PropTypes.object
    }
}
export default List;
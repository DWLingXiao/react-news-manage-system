import React, { useState,useEffect } from 'react'
import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined,UnorderedListOutlined,ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;


export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [rightList, setRightList] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [isModalVisible, setisModalVisible] = useState(false);
        
    useEffect(() => {
        axios.get('/roles').then(res => {
            setDataSource(res.data)
        })
    }, [])
        
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setRightList(res.data)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div >
                    <Button type="primary" 
                            shape="circle" 
                            icon={<UnorderedListOutlined />} 
                            onClick={() => {
                                setisModalVisible(true)
                                setCurrentRights(item.rights)
                                setCurrentId(item.id)
                            }}
                    />
                    <Button style={{marginLeft:"10px"}} 
                            shape="circle" 
                            danger 
                            icon={<DeleteOutlined/>} 
                            onClick={() => confirmMethod(item)}
                    />
                </div>
            }
        },
    ]

    function confirmMethod(item) {
        confirm({
          title: '确认删除吗?',
          icon: <ExclamationCircleOutlined />,
          onOk() {
            deleteMethod(item)
          },
          onCancel() {
            
          },
        });
    }
    const deleteMethod = (item) => {

        axios.delete(`/roles/${item.id}`)
        setDataSource(dataSource.filter(data => data.id !== item.id));
    }
    const handleOk = () => {
        setDataSource(dataSource.map(item => {
            if(item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        axios.patch(`/roles/${currentId}`, {
            rights : currentRights
        })
        setisModalVisible(false)

    }
    const handleCancel = () => {
        setisModalVisible(false)
    }
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys)
    }
    return (
        <div>
            <Table dataSource={dataSource} 
                   columns={columns} 
                   pagination={
                    {
                        pageSize:5
                    }
                   }
                   rowKey={(item) => item.id}/>

            <Modal  title="权限分配" 
                    visible={isModalVisible} 
                    onOk={handleOk} 
                    onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys = {currentRights}
                    treeData = {rightList}
                    onCheck = {onCheck}
                    checkStrictly={true}
                />
            </Modal>
        </div>
    )
}
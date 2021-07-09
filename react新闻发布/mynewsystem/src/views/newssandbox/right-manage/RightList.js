import React, { useState,useEffect } from 'react'
import { Table,Tag,Button,Modal,Popover,Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;



export default function RightList() {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get('/rights?_embed=children').then((res) =>{
            const list = res.data
            list.forEach(item => {
                if(item.children.length === 0) {
                    item.children = ""
                }
            })
            setDataSource(res.data)
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
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                        <Popover content={
                            <div style={{textAlign: 'center'}}>
                                <Switch checked={item.pagepermisson} 
                                        onClick={() => switchMethod(item)}>
                                </Switch>
                            </div>
                                        } 
                                title="页面配置" 
                                trigger={item.pagepermisson === undefined ? '' : 'click'}>
                            <Button type="primary" 
                                    shape="circle" 
                                    icon={<EditOutlined />} 
                                    disabled={item.pagepermisson === undefined}
                            />
                        </Popover>
                        
                        <Button style={{marginLeft:"10px"}}  
                                shape="circle" 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => confirmMethod(item)} 
                        />
                </div>
            }
        },
    ];

    const deleteMethod = (item) => {
        if(item.grade === 1) {
            axios.delete(`http://localhost:3000/rights/${item.id}`)
            setDataSource(dataSource.filter(data => data.id !== item.id));
            
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
         
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            axios.delete(`http://localhost:3000/children/${item.id}`)
            setDataSource([...dataSource])
        }
        
    }

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])

        if(item.grade === 1) {
            axios.patch(`http://localhost:3000/rights/${item.id}`, {
                pagepermisson : item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:3000/children/${item.id}`, {
                pagepermisson : item.pagepermisson
            })
        }
    }

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
    
    return (
        <div>
            <Table dataSource={dataSource} 
                   columns={columns} 
                   pagination={
                    {pageSize:5}
                   }
            />
        </div>
    )
}

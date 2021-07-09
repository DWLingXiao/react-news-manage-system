import React, { useState,useEffect } from 'react'
import { Table,Button,Modal,notification } from 'antd'
import axios from 'axios'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'

const { confirm } = Modal;



export default function NewsDraft(props) {
    const [dataSource, setDataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) =>{
            setDataSource(res.data)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类信息',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                        <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<EditOutlined />} 
                                onClick={() => {
                                    props.history.push(`/news-manage/update/${item.id}`)
                                }} 
                                
                        />
                        <Button 
                                style={{marginLeft:"10px"}}  
                                shape="circle" 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => confirmMethod(item)} 
                        />
                         <Button 
                                style={{marginLeft:"10px"}}  
                                type="primary" 
                                shape="circle" 
                                icon={<UploadOutlined />} 
                                onClick={() => handleCheck(item.id)}
                                
                        />
                </div>
            }
        },
    ];

    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
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
    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState:1
        }).then(res => {
            props.history.push("/audit-manage/list")
            
            notification.info({
                message: '通知',
                description:
                  `您可以到审核列表中查看`,
                placement:"bottomRight",
            });
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} 
                   columns={columns} 
                   pagination={
                    {pageSize:5}
                   }
                   rowKey={item => item.id}
            />
        </div>
    )
}

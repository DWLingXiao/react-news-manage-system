import React, { useEffect,useState } from 'react'
import { Table,Button,Tag,notification } from 'antd'
import axios from 'axios'

export default function AuditList(props) {
    const {username} = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setDataSource] = useState([])
    const colorList = ["",'orange','green','red']
    const auditList = ["",'审核中','已通过','未通过']
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
            setDataSource(res.data)
        })
    },[username])
    const columns = [
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
            title: '新闻分类',
            dataIndex: 'category',
            render:(category) => {
                return category.title
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render:(auditState) => {
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        
        {
            title: '操作',
            render: (item) => {
                return <div>
                        {
                            item.auditState === 1 && <Button danger onClick={() => handleRervert(item)}>撤销</Button>
                        }
                        {
                            item.auditState === 2 &&  <Button onClick={() => handlePublish(item)}>发布</Button>
                        }
                        
                        {
                            item.auditState === 3 &&  <Button type="primary" onClick={() => handleUpdate(item)}>修改</Button>
                        }
                        
                        
                        </div>
            }
        },
    ];
    const handleRervert = (item) => {
        setDataSource(dataSource.filter((data) => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState:0
        }).then(res => {
            notification.info({
                message: '通知',
                description:
                  `您可以到草稿箱中查看`,
                placement:"bottomRight",
            });
        })
    }
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }
    const handlePublish = (item) => {
        setDataSource(dataSource.filter((data) => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            "publishState":2,
            "publishTime":Date.now()
        }).then(res => {
            props.history.push('/publish-manage/published')
            notification.info({
                message: '通知',
                description:
                  `您可以到已发布中查看`,
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

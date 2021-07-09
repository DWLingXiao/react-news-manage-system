import axios from 'axios'
import { useEffect,useState } from 'react'
import { notification } from 'antd'
function usePublish(type) {

    const {username} = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    },[type,username])
    const handlePublish = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`,{
            "publishState":2,
            "publishTime":Date.now()
        }).then(() => {
            notification.info({
                message: '通知',
                description:
                  `您可以到已发布中查看您的新闻审核状态`,
                placement:"bottomRight",
            });
        })
    }
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`/news/${id}`,{
            "publishState":3
        }).then(() => {
            notification.info({
                message: '通知',
                description:
                  `您可以到已下线中查看您的新闻审核状态`,
                placement:"bottomRight",
            });
        })
    }
    const handleDelete = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))
        axios.delete(`/news/${id}`).then(() => {
            notification.info({
                message: '通知',
                description:
                  `下线新闻已删除`,
                placement:"bottomRight",
            });
        })
    }
    return{
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish
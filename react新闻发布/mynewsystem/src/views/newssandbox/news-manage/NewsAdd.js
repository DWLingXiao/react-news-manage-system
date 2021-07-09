import React, { useEffect, useState,useRef } from 'react'
import { PageHeader,Steps,Button,Form, Input,Select, message,notification } from 'antd';
import axios from 'axios'
import style from './News.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState([])
    const [content, setContent] = useState("")
    const NewsForm = useRef()
    const User = JSON.parse(localStorage.getItem("token"))
    const handleNext = () => {
        if(current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if(content === "") {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1)
            }
            
        }
    }
    const handlePre = () => {
        setCurrent(current - 1)
    }
    useEffect(() => {
        axios.get('/categories').then((res) => {
            setCategoryList(res.data)
        })
    },[])
    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content":content,
            "region":User.region ? User.region : "全球",
            "author":User.username,
            "roleId":User.roleId,
            "auditState":auditState,
            "publishState":0,
            "createTime":Date.now(),
            "star":0,
            "view":0,
            //"publishTime":0
        }).then(res => {
            props.history.push(auditState===0?"/news-manage/draft":"/audit-manage/list")
            
            notification.info({
                message: '通知',
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看`,
                placement:"bottomRight",
            });
        })
    }
    return (
        <div>
            <PageHeader
            className="site-page-header"
            title="撰写新闻"
            subTitle="撰写新闻"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            
            <div style={{marginTop:"50px"}}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        ref={NewsForm}
                        >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择新闻分类' }]}
                        >
                            <Select>
                                {
                                    categoryList.map((item) => 
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}>3333</div>
            </div>


            <div style={{marginTop:"50px"}}>
                {
                    current > 0 && <Button onClick={() => handlePre()}>上一步</Button>
                }
                {
                    current < 2 && <Button style={{marginLeft:"20px"}} type="primary" onClick={() => handleNext() } >下一步</Button>
                }
                
                {
                    current === 2 && <span>
                        <Button 
                                style={{float:"right", overflow:"hidden"}} 
                                danger 
                                onClick={() => {
                                    handleSave(1)
                                }}>提交审核</Button>
                        <Button 
                                type="primary" 
                                style={{marginLeft:"20px"}} 
                                onClick={() => {
                                    handleSave(0)
                                }}>保存草稿</Button>
                    </span>
                }
            </div>
        </div>
    )
}

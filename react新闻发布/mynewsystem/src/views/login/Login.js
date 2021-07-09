import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';
import axios from 'axios'
import './Login.css'

export default function Login(props) {
    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            if(res.data.length === 0) {
                message.error("用户名或者密码错误")
            } else {
                localStorage.setItem("token", JSON.stringify(res.data[0]))
                props.history.push('/')
            }
        })
    }
    return (
        <div style={{background:'rgb(35,39,65)', height: '100%'}}>
            <div className="formContainer">
                <div className="loginTitle">全球新闻管理系统</div>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
            >
            <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input 
                    prefix={<UserOutlined className="site-form-item-icon" />} 
                    placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                登录
                </Button>
            </Form.Item>
            </Form>
            
            </div>
        </div>
    )
}

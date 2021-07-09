import React, { forwardRef,useState,useEffect } from 'react'
import { Form,Input,Select } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props,ref) => {
    const [isDisable, setIsDisable] = useState(false)
    const {roleId,region} = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
    }
    const checkReginDisable = (item) => {
        if(props.isUpdate) {
            if(roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if(roleObj[roleId] === "superadmin") {
                return false
            } else {
                return item.value !== region
            }
        }
    }
    const checkRoleDisable = (item) => {
        if(props.isUpdate) {
            if(roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if(roleObj[roleId] === "superadmin") {
                return false
            } else {
                return roleObj[item.id] !== 'editor'
            }
        }
    }
    useEffect(() => {
        setIsDisable(props.isUpdateDisable)
    }, [props.isUpdateDisable])
    return (
        <Form
            ref={ref}
            layout="vertical"
            >
                <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码!' }]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="region"
                label="区域"
                rules={isDisable ? [] : [{ required: true, message: '请选择区域!' }]}

                >
                <Select disabled={isDisable}>
                    {
                        props.regionList.map((item) => 
                            <Option value={item.region} 
                                    key={item.id}
                                    disabled={checkReginDisable(item)}
                            >{item.title}</Option>
                        )
                    }
                </Select>
                </Form.Item>
                <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: '请选择角色!' }]}
                >
                <Select onChange={(value) => {
                    if(value === 1) {
                        setIsDisable(true)
                        ref.current.setFieldsValue({
                            region:""
                        })
                    } else {
                        setIsDisable(false)
                    }
                }}>
                    {
                        props.roleList.map((item) => 
                            <Option value={item.id} 
                                    key={item.id}
                                    disabled={checkRoleDisable(item)}
                                    >{item.roleName}</Option>
                        )
                    }
                </Select>
                </Form.Item>
        </Form>
                
    )
    
})
export default UserForm
import React, { useState,useEffect,useRef } from 'react'
import { Table,Switch,Button,Modal } from 'antd'
import axios from 'axios'
import { DeleteOutlined,FormOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;


export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [isAddvisible, setIsAddvisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [isUpdateDisable, setIsUpdateDisable] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    const [current, setCurrent] = useState([])
    const addForm = useRef();
    const updateForm = useRef();


    const { roleId,region,username } = JSON.parse(localStorage.getItem("token"))
    const regionArr = ['亚洲','欧洲','北美洲','南美洲','非洲','大洋洲','南极洲']
    useEffect(() => {
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios.get('/users?_expand=role').then((res) =>{
            const list = res.data
            setDataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])
        })
    }, [roleId,region,username])
    useEffect(() => {
        axios.get('/regions').then((res) =>{
            setRegionList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('/roles').then((res) =>{
            setRoleList(res.data)
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters:[
                ...regionList.map(item => ({
                    text:item.title,
                    value:item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                },
            ],
            onFilter: (value, item) => {
                if(value === '全球') {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region === "" ? "全球" : `${region}`}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState,item) => {
                return <Switch checked={roleState}
                               disabled={item.default}
                               onChange={() => handleChange(item)}
                        ></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div >
                    <Button type="primary" 
                            shape="circle" 
                            icon={<FormOutlined />} 
                            disabled={item.default}
                            onClick={() => handleUpdate(item)}
                    />
                    <Button style={{marginLeft:"10px"}} 
                            shape="circle" 
                            danger 
                            icon={<DeleteOutlined/>} 
                            onClick={() => confirmMethod(item)}
                            disabled={item.default}
                    />
                </div>
            }
        },
    ];
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
        axios.delete(`http://localhost:3000/users/${item.id}`)
        setDataSource(dataSource.filter(data => data.id !== item.id))
    }

    const addFormOk = () => {
        addForm.current.validateFields().then((value) => {
            setIsAddvisible(false);
            addForm.current.resetFields();
            axios.post('/users', {
                "username":value.username,
                "password":value.password,
                "roleId":value.roleId,
                "region":regionArr[value.region] || "",
                "roleState": true,
                "default": false,
            }).then(res => {
                setDataSource([...dataSource, {...res.data,role:roleList.filter(item => item.id === value.roleId)[0]}])
                console.log(value)
            })
        }).catch((err) => {
            console.log(err)
        })
        
    }

    const handleChange = (item) => {
        item.roleState = !item.roleState
        axios.patch(`/users/${item.id}`, {
            roleState:item.roleState
        })
        setDataSource([...dataSource])
    }

    const handleUpdate = (item) => {
        setTimeout(() => {
            setisUpdateVisible(true)
            if(item.roleId === 1) {
                setIsUpdateDisable(true)
            } else {
                setIsUpdateDisable(false)
            }
            updateForm.current.setFieldsValue(item)
        },0)
        setCurrent(item)
    }
    const updateFormOk = () => {
        updateForm.current.validateFields().then((value) => {
            setisUpdateVisible(false);
            updateForm.current.resetFields();
            setDataSource(dataSource.map(item => {
                if(item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role:roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setIsUpdateDisable(!isUpdateDisable)
            axios.patch(`/users/${current.id}`, value)
            
        })
    }
    return (
        <div>
            <Button style={{marginTop: "-10px",marginBottom: "10px"}}
                    onClick={() => {setIsAddvisible(true)}}>添加用户</Button>
            <Table dataSource={dataSource} 
                   columns={columns} 
                   pagination={
                    {pageSize:5}
                   }
                   rowKey={(item) => item.id}
            />
            <Modal
                visible={isAddvisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsAddvisible(false)
                }}
                onOk={() => addFormOk()}
                >
                <UserForm regionList={regionList}
                          roleList={roleList}
                          ref={addForm}
                ></UserForm>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setIsUpdateDisable(!isUpdateDisable)
                }}
                onOk={() => updateFormOk()}
                >
                <UserForm regionList={regionList}
                          roleList={roleList}
                          ref={updateForm}
                          isUpdateDisable={isUpdateDisable}
                          isUpdate = {true}
                ></UserForm>
            </Modal>
        </div>
    )
}

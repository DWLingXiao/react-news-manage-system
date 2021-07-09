import React, { useState,useEffect,useRef,useContext } from 'react'
import { Table,Button,Modal,Form,Input } from 'antd'
import axios from 'axios'
import { DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;
const EditableContext = React.createContext(null);

export default function NewsCategory() {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get('/categories').then((res) =>{
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
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title:'栏目名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>            
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
        axios.delete(`/categories/${item.id}`)
        setDataSource(dataSource.filter(data => data.id !== item.id));
    }
    const handleSave = (record) => {
        setDataSource(dataSource.map(item => {
            if(item.id === record.id) {
                return {
                    id:item.id,
                    title:record.title,
                    value:record.title
                }
            }
            return item
        }))
        axios.patch(`/categories/${record.id}`,{
            title:record.title,
            value:record.title
        })
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
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
          <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
              <tr {...props} />
            </EditableContext.Provider>
          </Form>
        );
      };
      
      const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
      }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
          if (editing) {
            inputRef.current.focus();
          }
        }, [editing]);

        const toggleEdit = () => {
          setEditing(!editing);
          form.setFieldsValue({
            [dataIndex]: record[dataIndex],
          });
        };
      
        const save = async () => {
          try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
          } catch (errInfo) {
            console.log('Save failed:', errInfo);
          }
        };
      
        let childNode = children;
      
        if (editable) {
          childNode = editing ? (
            <Form.Item
              style={{
                margin: 0,
              }}
              name={dataIndex}
              rules={[
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ]}
            >
              <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
          ) : (
            <div
              className="editable-cell-value-wrap"
              style={{
                paddingRight: 24,
              }}
              onClick={toggleEdit}
            >
              {children}
            </div>
          );
        }

        return <td {...restProps}>{childNode}</td>;
      };
    return (
        <div>
            <Table dataSource={dataSource} 
                   columns={columns} 
                   pagination={
                    {pageSize:5}
                   }
                   rowKey={item => item.id}
                   components={{
                       body:{
                           row: EditableRow,
                           cell: EditableCell
                        },
                   }}
            />
        </div>
    )
}

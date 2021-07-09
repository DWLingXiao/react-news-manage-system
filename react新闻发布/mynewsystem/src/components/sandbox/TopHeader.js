import React from 'react'
import { Layout,Dropdown,Menu,Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
  } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

const { Header} = Layout;

function TopHeader(props) {
    //const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        // setCollapsed(!collapsed)
        props.changeCollapsed()
    }
    const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
    const menu = (
        <Menu>
          <Menu.Item key="1">
            {roleName}
          </Menu.Item>
          <Menu.Item danger 
                     key="2" 
                     onClick={() => {
                      localStorage.removeItem("token")
                      props.history.replace("/login")
                     }}>退出登录
          </Menu.Item>
        </Menu>
      );
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
            }
            <div style={{float : 'right'}}>
                <span><b>欢迎 </b> <span style={{color:"rgb(124, 156, 243)"}}>{username}</span> <b> 回来</b></span>
                    <Dropdown overlay={menu}>
                    <Avatar style={{marginLeft:'10px'}} size={38} icon={<UserOutlined />} />
                    </Dropdown>
            </div>
        </Header>
    )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {

  return {
    isCollapsed
  }
}
const mapDispathcToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed"
    }
  }
}

export default connect(mapStateToProps,mapDispathcToProps)(withRouter(TopHeader))
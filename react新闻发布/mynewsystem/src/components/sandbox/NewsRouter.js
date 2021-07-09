import React,{ useEffect,useState } from 'react'
import { Switch,Route,Redirect } from 'react-router-dom'
import { Spin } from 'antd'
import Home from '../../views/newssandbox/home/Home'
import UserList from '../../views/newssandbox/user-manage/UserList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import RightList from '../../views/newssandbox/right-manage/RightList'
import NoPermission from '../../views/newssandbox/nopermission/NoPermission'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/newssandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/newssandbox/news-manage/NewsDraft'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'
import Audit from '../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../../views/newssandbox/publish-manage/Unpublished'
import Sunset from '../../views/newssandbox/publish-manage/Sunset'
import Published from '../../views/newssandbox/publish-manage/Published'
import axios from 'axios'
import { connect } from 'react-redux'

const LocalRouterMap = {
    '/home':Home,
    '/user-manage/list':UserList,
    '/right-manage/role/list':RoleList,
    '/right-manage/right/list':RightList,
    '/news-manage/add':NewsAdd,
    '/news-manage/draft':NewsDraft,
    '/news-manage/category':NewsCategory,
    '/news-manage/preview/:id':NewsPreview,
    '/news-manage/update/:id':NewsUpdate,
    '/audit-manage/audit':Audit,
    '/audit-manage/list':AuditList,
    '/publish-manage/unpublished':Unpublished,
    '/publish-manage/published':Published,
    '/publish-manage/sunset':Sunset
}
function NewsRouter(props) {

    const [backRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res => {
            setBackRouteList([...res[0].data,...res[1].data])
        })
    }, [])
    const {role:{rights},roleId} = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return ((roleId === 1 || 3)? rights.includes(item.key) : rights.checked.includes(item.key))
    }
    return (
        <Spin size="large" spinning={props.isLoading}>
        <Switch>
            {
                backRouteList.map(item => {
                    if(checkRoute(item) && checkUserPermission(item)) {
                        return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                    } else {
                        return null
                    }
                })
            }

            <Redirect from='/' to='/home' exact></Redirect>
            {
                backRouteList.length > 0 && <Route path="*" component={NoPermission}></Route>
            }
        </Switch>
        </Spin>
    )
}
const mapStateToProps = ({LoadingReducer:{isLoading}}) => {
    return {
        isLoading
    }
}
const mapDispathcToProps = {
    changeCollapsed(){
      return {
        type:"change_loading"
      }
    }
  }
export default connect(mapStateToProps,mapDispathcToProps)(NewsRouter)
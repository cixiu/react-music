import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from 'base/loading/loading';
// 路由懒加载
const Recommend = Loadable({
    loader: () => import('components/recommend/recommend'),
    loading: Loading
})
const Singer = Loadable({
    loader: () => import('components/singer/singer'),
    loading: Loading
})
const Rank = Loadable({
    loader: () => import('components/rank/rank'),
    loading: Loading
})
const Search = Loadable({
    loader: () => import('components/search/search'),
    loading: Loading
})
const UserCenter = Loadable({
    loader: () => import('components/user-center/user-center'),
    loading: Loading
})


const RouterConfig = (
    <Route render={({location, history}) => {
        return (
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/recommend" />}/>
                <Route path="/recommend" component={Recommend}/>
                <Route path="/singer" component={Singer}/>
                <Route path="/rank" component={Rank}/>
                <Route path="/search" component={Search}/>
                <Route path="/user-center" component={UserCenter}/>
            </Switch>
        )
    }}/>
);

export default RouterConfig;

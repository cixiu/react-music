import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import UserCenter from 'components/user-center/user-center';


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

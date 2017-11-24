import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';


const RouterConfig = (
    <Switch>
        <Route exact path="/" render={() => (<Redirect to="/recommend"/>)}/>
        <Route path="/recommend" component={Recommend}/>
        <Route path="/singer" component={Singer}/>
        <Route path="/rank" component={Rank}/>
        <Route path="/search" component={Search}/>
    </Switch>
);

export default RouterConfig;

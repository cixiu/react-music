import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import SingerDetail from 'components/singer-detail/singer-detail';


const RouterConfig = (
    <Route render={({location, history}) => {
        return (
            <div>
                <Route exact path="/" render={() => <Redirect to="/recommend" />}/>
                <Route path="/recommend" component={Recommend}/>
                <Route path="/singer" component={Singer}/>
                {/* <TransitionGroup> */}
                    {/* <CSSTransition key={location.key} classNames="slide" timeout={5000}> */}
                        <Route path="/singer/:id" component={SingerDetail}/>
                    {/* </CSSTransition> */}
                {/* </TransitionGroup> */}
                <Route path="/rank" component={Rank}/>
                <Route path="/search" component={Search}/>
            </div>
        )
    }}/>
);

export default RouterConfig;

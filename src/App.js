import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import RouterConfig from 'router/routers';
import Player from 'components/player/player';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<MHeader />
					<Tab />
					{RouterConfig}
					<Player />
				</div>
			</Router>
		);
	}
}

export default App;

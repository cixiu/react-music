import React from 'react';
import ReactDOM from 'react-dom';
import fastclick from 'fastclick';
import { Provider } from 'react-redux';
import store from 'store';
import 'common/stylus/index.styl';
import App from './App';

fastclick.attach(document.body);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

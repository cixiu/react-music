import rootReducers from 'store/reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

const store = createStore(rootReducers, {
        singer: {}
    },
    composeEnhancers(
        applyMiddleware(
            loggerMiddleware
        )
    )
)

export default store;
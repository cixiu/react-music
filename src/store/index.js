import rootReducers from 'store/reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { playMode } from 'common/js/config';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

const initialState = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {}
}

const store = createStore(rootReducers, initialState,
    composeEnhancers(
        applyMiddleware(
            loggerMiddleware
        )
    )
)

export default store;
import rootReducers from 'store/reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import { playMode } from 'common/js/config';
import { loadSearch, loadPlayed, loadFavorite } from 'common/js/cache';

const middlewares = [];
let composeEnhancers = compose;

if (process.env.NODE_ENV === `development`) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    middlewares.push(logger);
}

const initialState = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlayed(),
    favoriteList: loadFavorite()
}

const store = createStore(rootReducers, initialState,
    composeEnhancers(
        applyMiddleware(
            ...middlewares
        )
    )
)

export default store;
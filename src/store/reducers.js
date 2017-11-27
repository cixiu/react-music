import { combineReducers } from 'redux';
import * as types from './actionTypes';
// 单个歌手信息
const setSinger = (state = {}, action) => {
    switch (action.type) {
        case types.SET_SINGER:
            return action.singer
        default:
            return state
    }
}

const rootReducers = combineReducers({
    singer: setSinger
})

export default rootReducers;


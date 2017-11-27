import { combineReducers } from 'redux';
import * as types from './actionType';
// 处理歌手路由中左右列表联动的index
const getSingerIndex = (state = 0, action) => {
    switch (action.type) {
        case types.ADD_SINGER_INDEX:
            return action.index
        default:
            return state
    }
}

const rootReducers = combineReducers({
    shortcutIndex: getSingerIndex
})

export default rootReducers;


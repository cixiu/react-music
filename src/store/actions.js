import * as types from './actionTypes';

export const setSinger = (singer) => ({
    type: types.SET_SINGER,
    singer
})

export const setPlayStatus = (flag) => ({
    type: types.SET_PLAY_STATUS,
    flag
})

export const setFullScreen = (flag) => ({
    type: types.SET_FULL_SCREEN,
    flag
})

export const setPlayList = (list) => ({
    type: types.SET_PLAY_LIST,
    list
})

export const setSequenceList = (list) => ({
    type: types.SET_SEQUENCE_LIST,
    list
})

export const setPlayMode = (mode) => ({
    type: types.SET_PLAY_MODE,
    mode
})

export const setCurrentIndex = (index) => ({
    type: types.SET_CURRENT_INDEX,
    index
})

export const setDisc = (disc) => ({
    type: types.SET_DISC,
    disc
})

export const setTopList = (topList) => ({
    type: types.SET_TOP_LIST,
    topList
})
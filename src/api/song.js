import { commonParams, options } from 'api/config';
import axios from 'axios';
import jsonp from 'common/js/jsonp';
// import { getUid } from 'common/js/uid';

export const getLyric = (mid) => {
    const url = '/api/getLyric';

    const data = {
        ...commonParams,
        pcachetime: +new Date(),
        songmid: mid,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0
    }

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data);
    })
}

// 获取歌曲播放的key值
export const getVKey = (songmid, filename) => {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

    const data = {
        ...commonParams,
        cid: 205361747,
        format: 'json',
        platform: 'yqq',
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        uin: 0,
        songmid,
        filename,
        guid: 7908462822
    }

    return jsonp(url, data, {
        ...options,
        param: 'callback'
    })
}
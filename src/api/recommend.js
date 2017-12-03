import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

// 获取推荐页面的slider数据
export const getRecommend = () => {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

    const data = {
        ...commonParams,
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    };

    return jsonp(url, data, options);
}

// 获取推荐的歌单数据
export const getDiscList = () => {
    const url = '/api/getDiscList';

    const data = {
        ...commonParams,
        picmid: 1,
        rnd: Math.random(),
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        categoryId: 10000000,
        sortId: 5,
        sin: 0,
        ein: 29,
        format: 'json'
    };

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 获取推荐歌单的详情
export const getCdInfo = (disstid) => {
    const url = '/api/getCdInfo';

    const data = {
        ...commonParams,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid,
        format: 'json',
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    };

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data);
    })
}

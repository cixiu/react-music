import jsonp from 'common/js/jsonp';
import { commonParams, options } from 'api/config';

// 获取排行榜列表数据
export const getTopList = () => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

    const data = {
        ...commonParams,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        _: +new Date()
    }

    return jsonp(url, data, options);
}

// 获取指定的排行榜歌曲列表
export const getMusicList = (topid) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

    const data = {
        ...commonParams,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid,
        _: +new Date()
    }

    return jsonp(url, data, options);
}
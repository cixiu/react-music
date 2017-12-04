import jsonp from 'common/js/jsonp';
import { commonParams, options } from 'api/config';

// 获取热门搜索词
export const getHotkey = () => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

    const data = {
        ...commonParams,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        _: +new Date()
    }

    return jsonp(url, data, options);
}

// 通过搜索词进行查询
export const search = (query, page, zhida, perpage) => {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

    const data = {
        ...commonParams,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        w: query,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage,
        n: perpage,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: +new Date()
    };

    return jsonp(url, data, options);
}
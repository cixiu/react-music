var express = require('express')
var history = require('connect-history-api-fallback');
var axios = require('axios')

var app = express()
var apiRouter = express.Router();

// 代理热门歌单推荐列表
apiRouter.get('/getDiscList', function (req, res) {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then(response => {
        res.json(response.data)
    }).catch(e => {
        console.log(e)
    });
});
// 代理歌词
apiRouter.get('/getLyric', function (req, res) {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then(response => {
        let ret = response.data;
        if (typeof ret === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/;
            let matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret)
    }).catch(e => {
        console.log(e)
    });
});
// 代理歌单详情
apiRouter.get('/getCdInfo', function (req, res) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then(response => {
        let ret = response.data;
        if (typeof ret === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/;
            let matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret)
    }).catch(e => {
        console.log(e)
    });
});

app.use('/api', apiRouter)
app.use(express.static('./build'))

// 配置HTML5 History 模式
app.use(history())
app.use(express.static('./build'))

var port = process.env.PORT || 8088

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})
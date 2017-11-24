/**
jsonp(url, opts, fn)
    url (String) url to fetch
    opts (Object), optional
        param (String) name of the query string parameter to specify the callback (defaults to callback)
        timeout (Number) how long after a timeout error is emitted. 0 to disable (defaults to 60000)
        prefix (String) prefix for the global callback functions that handle jsonp responses (defaults to __jp)
        name (String) name of the global callback functions that handle jsonp responses (defaults to prefix + incremented counter)
    fn callback
The callback is called with err, data parameters.

If it times out, the err will be an Error object whose message is Timeout.

Returns a function that, when called, will cancel the in-progress jsonp request (fn won't be called).
 */
import OriginJSONP from 'jsonp';

const jsonp = (url, data, opts) => {
    // url拼接
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);

    return new Promise((resolve, reject) => {
        OriginJSONP(url, opts, (err, data) => {
            if (!err) {
                return resolve(data);
            } else {
                return reject(err);
            }
        });
    });
}

const param = data => {
    let url = '';
    for (let key in data) {
        let value = data[key] !== undefined ? data[key] : '';
        url += `&${key}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
}

export default jsonp;

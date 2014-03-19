var request = require('request');
var inspect = require('util').inspect;
/* by using the options object, you can also send some custom headers.
 *
 */

var options = {
    url: 'http://localhost:4001/abc/def',
    method: 'PUT',
    headers: {
        'X-MY-Header': 'value'
    }
};

request(options, function(err, res, body) {
    if (err) { throw err; }
    console.log(inspect({
        err: err,
        res: {
            statusCode: res.statusCode,
            headers: res.headers
        },
        body: JSON.parse(body)
    }));
});

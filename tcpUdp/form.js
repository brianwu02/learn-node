var request = require('request');
var inspect = require('inspect');
/* Sometimes, you have to send some data on the request body.
 * You can use the form-encoding to encode the body, which mimics how the browser
 * encodes arguments in the body string. 
 */
body = {
    a: 1,
    b: 2
};

var options = {
    url: 'http://localhost:4001/print/body',
    form: body
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

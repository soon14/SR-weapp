let util = require('./util');
let request = require('request');
let md5 = require('MD5');
let Q = require('q');

exports = module.exports = WXPay;

function WXPay() {
	if (!(this instanceof WXPay)) {
		return new WXPay(arguments[0]);
	}
	this.options = arguments[0];
	this.wxpayID = { sub_appid:this.options.sub_appid, mch_id:this.options.mch_id };
}

WXPay.mix = function(){
	switch (arguments.length) {
		case 1:
            let obj = arguments[0];
			for (let key in obj) {
				if (WXPay.prototype.hasOwnProperty(key)) {
					throw new Error('Prototype method exist. method: '+ key);
				}
				WXPay.prototype[key] = obj[key];
			}
			break;
		case 2:
            let key = arguments[0].toString(), fn = arguments[1];
			if (WXPay.prototype.hasOwnProperty(key)) {
				throw new Error('Prototype method exist. method: '+ key);
			}
			WXPay.prototype[key] = fn;
			break;
	}
};

WXPay.mix('option', function(option){
	for( let k in option ) {
		this.options[k] = option[k];
	}
});

WXPay.mix('sign', function(param){
	let querystring = Object.keys(param).filter(function(key){
		return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
	}).sort().map(function(key){
		return key + '=' + param[key];
	}).join("&") + "&key=" + this.options.partner_key;

	return md5(querystring).toUpperCase();
});

WXPay.mix('createSpeedposUnifiedOrder', function(uri, opts, fn) {
    const deferred = Q.defer();
    opts.nonce_str = opts.nonce_str || util.generateNonceString();
    util.mix(opts, this.wxpayID);
    opts.sign = this.sign(opts);
    request({
        url: uri,
        method: 'POST',
        body: util.buildXML({ xml: opts }),
        agentOptions: {
            pfx: this.options.pfx,
            passphrase: this.options.mch_id,
        },
    }, function(err, response, body) {
        console.log(uri, '========uri============');
        console.log(body, '========body============');
        util.parseXML(body, function(err, result) {
            deferred.resolve(result);
        });
    });
    return deferred.promise;
});


WXPay.mix('createUnifiedOrder', function(uri, opts, fn){
    let deferred = Q.defer();
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.wxpayID);
	opts.sign = this.sign(opts);
	request({
		url: uri,
		method: 'POST',
		body: util.buildXML(opts),
		agentOptions: {
			pfx: this.options.pfx,
			passphrase: this.options.mch_id
		}
	}, function(err, response, body){
        console.log(uri, '========uri============');
        console.log(body, '========body============');
        util.parseXML(body, function (err, result) {
            deferred.resolve(result);
        });
	});
    return deferred.promise;
});

WXPay.mix('getBrandWCPayRequestParams', function(order, fn){
	order.trade_type = "JSAPI";
	let _this = this;
	this.createUnifiedOrder(order, function(err, data){
        let reqparam = {
			appId: _this.options.appid,
			timeStamp: Math.floor(Date.now()/1000)+"",
			nonceStr: data.nonce_str,
			package: "prepay_id="+data.prepay_id,
			signType: "MD5"
		};
		reqparam.paySign = _this.sign(reqparam);
		fn(err, reqparam);
	});
});

WXPay.mix('useWXCallback', function(fn){
	return function(req, res, next){
        let _this = this;
		res.success = function(){ res.end(util.buildXML({ xml:{ return_code:'SUCCESS' } })); };
		res.fail = function(){ res.end(util.buildXML({ xml:{ return_code:'FAIL' } })); };
		util.pipe(req, function(err, data){
            let xml = data.toString('utf8');
			util.parseXML(xml, function(err, msg){
				req.wxmessage = msg;
				fn.apply(_this, [msg, req, res, next]);
			});
		});
	};
});
 

WXPay.mix('queryOrder', function(uri, query){
    let deferred = Q.defer();
    if (!(query.transaction_id || query.out_trade_no)) {
		return false;
	}
	query.nonce_str = query.nonce_str || util.generateNonceString();
	util.mix(query, this.wxpayID);
	query.sign = this.sign(query);
	request({
		url: uri,
		method: "POST",
		body: util.buildXML({xml: query})
	}, function(err, res, body){
		util.parseXMLNew(body, function (err, result) {
            deferred.resolve(result);
        });
	});
    return deferred.promise;
});

WXPay.mix('closeOrder', function(uri, order, fn){
	if (!order.out_trade_no) {
		fn(null, { return_code:"FAIL", return_msg:"缺少参数" });
	}
	order.nonce_str = order.nonce_str || util.generateNonceString();
	util.mix(order, this.wxpayID);
	order.sign = this.sign(order);
	request({
		url: uri,
		method: "POST",
		body: util.buildXML({xml:order})
	}, function(err, res, body){
		util.parseXML(body, fn);
	});
});

WXPay.mix('refund',function(uri, order, fn){
	if (!(order.transaction_id || order.out_refund_no)) { 
		fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
	}
	order.nonce_str = order.nonce_str || util.generateNonceString();
	util.mix(order, this.wxpayID);
	order.sign = this.sign(order);
	request({
		url: uri,
		method: "POST",
		body: util.buildXML({xml: order}),
		agentOptions: {
			pfx: this.options.pfx,
			passphrase: this.options.mch_id
		}
	}, function(err, response, body){
		util.parseXML(body, fn);
	});
});
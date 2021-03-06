/*!
 * nodebox - controllers/send.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var nfs = require('../common/nfs');
var utils = require('../lib/utils');
var mime = require('mime');
var path = require('path');
var common = require('./common');

/**
 * Content-Length must set.
 * 
 * POST /send?name=foo.jpg
 * Content-Length: 1234
 * [Content-Type: 'application/octet-stream']
 */

function send(req, res) {
  var size = parseInt(req.headers['content-length'], 10);
  var name = req.query.name;
  if (!name) {
    res.writeHead(403);
    res.end(JSON.stringify({
      error: 'name missing'
    }));
    return;
  }

  var mimeType = req.headers['content-type'] || mime.lookup(name);
  var storePath = name;
  if (!req.user) {
    var storeName = utils.md5(Date.now() + name + Math.random() + size);
    storePath = common.formatStorePath(storeName, path.extname(name));
  }
  
  nfs.pipe(storePath, mimeType, req, size, function (err, data) {
    common.sendResult(storePath, size, mimeType, err, data, res);
  });
}

module.exports = send;

weibo-oauth
===============

微博公共平台 OAuth 接口消息接口服务中间件与 API SDK。  
**NOTE**: Forked from [node-wechat][], thanks to them!

[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![Dependency status][david-img]][david-url]
[![License][license-img]][license-url]

## 功能列表

- OAuth授权
- 获取基本信息

OAuth 2.0 网页授权，使用此接口须通过微博认证。详见：[open weibo][]


## Installation

```sh
$ npm install weibo-oauth
```

## Usage

### 初始化

引入 OAuth 并实例化

```js
const OAuth = require('weibo-oauth')
const client = new OAuth('client_id', 'client_secret', 'redirect_uri')
```

以上即可满足单进程使用。
当多进程时，token需要全局维护，以下为保存token的接口。

```js
const client = new OAuth('appid', 'secret', function (uid, callback) {
  // 传入一个根据 `uid` 获取对应的全局 token 的方法
  // 在 getUser 时会通过该方法来获取token
  fs.readFile(uid +':access_token.txt', 'utf8', function (err, txt) {
    if (err) { return callback(err) }
    callback(null, JSON.parse(txt))
  });
}, function (uid, token, callback) {
  // 请将 token 存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis 等
  // 这样才能在 cluster 模式及多机情况下使用，以下为写入到文件的示例
  // 持久化时请注意，每个 uid 都对应一个唯一的 token!
  fs.writeFile(uid + ':access_token.txt', JSON.stringify(token), callback);
});
```

### 引导用户
生成引导用户点击的URL。

```js
var url = client.getAuthorizeURL('redirectUri', 'state', 'scope');
```

如果是PC上的网页，请使用以下方式生成
```js
var url = client.getAuthorizeURLForWebsite('redirectUri');
```

### 获取 uid 和 AccessToken

用户点击上步生成的URL后会被重定向到上步设置的 `redirectUri`，
并且会带有 `code` 参数，我们可以使用这个 `code`  
换取 `access_token` 和用户的 `uid`

```js
client.getAccessToken('code', function (err, result) {
  const accessToken = result.data.access_token;
  const uid = result.data.uid;
});
```

### 获取用户信息
如果我们生成引导用户点击的URL中 `scope` 参数值为 `users_show`，
接下来我们就可以使用 `uid` 换取用户详细信息（必须在 getAccessToken 方法执行完成之后）

```js
client.getUser('uid', function (err, result) {
  const userInfo = result;
});
```

[license-url]: LICENSE
[open weibo]: http://open.weibo.com/wiki/%E5%BE%AE%E5%8D%9AAPI
[npm-img]: https://img.shields.io/npm/v/weibo-oauth.svg?style=flat-square
[npm-url]: https://npmjs.org/package/weibo-oauth
[travis-img]: https://img.shields.io/travis/fundon/weibo-oauth.svg?style=flat-square
[travis-url]: https://travis-ci.org/fundon/weibo-oauth
[coveralls-img]: https://img.shields.io/coveralls/fundon/weibo-oauth.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/fundon/weibo-oauth?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[david-img]: https://img.shields.io/david/fundon/weibo-oauth.svg?style=flat-square
[david-url]: https://david-dm.org/fundon/weibo-oauth
[downloads-image]: https://img.shields.io/npm/dm/weibo-oauth.svg?style=flat-square
[node-wechat]: https://github.com/node-webot/wechat-oauth

<a href="https://greatsage.vercel.app"><img src="https://greatsage.vercel.app/bella_iknowthis.webp?sanitize=true" height="150" align="right"></a>

# Great Sage

动机是[luooooob/vscode-asoul-notifications](https://github.com/luooooob/vscode-asoul-notifications)客户端主动爬取数据的性能问题。为了解决这个问题顺便写了一个自动更新的成员动态页面。

于是有了本项目，一个以全免费云服务为前提开发的B站up主动态跟踪工具，解决B站这种无法分组动态以及没有webhook用于第三方实现动态推送的问题。

我也不知道B站那个关注分组的意义何在，怎么看怎么像半成品，该不会是“产能不足”吧？叔叔你米都自己洽了是吗？

理论上来说可以用来跟踪和推送任意B站up主甚至是其他网站某些用户的动态，下面的洋屁是详细的部署细节。

## How Does it Work

Clients get data with requests to `/api/delay`. Or passively get websocket messages from pusher.

The server crawls the latest results to respond to `/api/delay` and broadcasts notifications if new dynamics spotted.

There's a checkly service to call the api routinely which means there will always be at least one client asking for lastest results activily to make sure all passive clients will get notifications when needed.

All requests are controlled by Redis under specific rate limits.

## Environment Variables

```bash
PUSHER_APPID=0717
PUSHER_KEY=be11abe11abe11abe11a
PUSHER_SECRET=be11abe11abe11abe11a
REDIS_ENDPOINT=be11a-717.c257.us-east-1-3.ec2.cloud.redislabs.com:717
REDIS_PASSWORD=be11abe11abe11abe11abe11abeee11a
BILIBILI_UIDS=672353429,351609538
```

## The Free Services Tier

- Github, Vercel, Checkly
- Pusher: 200k messages per day, 100 connections
- Redis Cloud: 30Mb, 30 connections

## Self-host Instructions

What you need:

- an email, sign up an account in following steps if you don't have one
- Github & Vercel: [deploy this repo](/) follow the friendly instructions from the Vercel team
- [Pusher](https://pusher.com/): subscribe the free plan
  - PUSHER_APPID
  - PUSHER_KEY
  - PUSHER_SECRET
- [Redis Cloud](https://redis.com/try-free/): subscribe the free plan
  - REDIS_ENDPOINT
  - REDIS_PASSWORD
- Go to vercel panel(url like `https://vercel.com/[realbellakira]/[greatsage]/settings/environment-variables`) and set up the [required environment variables](#Environment-Variables) mentioned before
- Install the [checkly service](https://vercel.com/integrations/checkly) in the vercel market
  - config the checkly to visit `/api/relay` with specific schedules

You may customize the watched ups' uids with the environment variable called `BILIBILI_UIDS` which's seprated by comma.

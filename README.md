# Vector Logistics!

[![Netlify Status](https://api.netlify.com/api/v1/badges/dda09e4f-8fc9-4bfe-ab45-a1f0095de554/deploy-status)](https://app.netlify.com/sites/krissvector/deploys)

**[Vector Logistics](https://krissvector.moe/)** is an web application to support [Girls' Frontline](https://gf.sunborngame.com/) Shikikans, by recommending optimal combination of [logistic supports](https://iopwiki.com/wiki/Logistic_Support) for each user.

## About the Logistic Support System

There are 4 basic resource types and 5 advanced items in Girls' Frontline. They are used for various purpose in game system.

- Basic
  - Manpower
  - Ammo
  - Rations
  - Parts
- Advanced
  - Quick Restoration Contract
  - Quick Production Contract
  - T-Doll Contract
  - Equipment Contract
  - Token

**Logistic support** is a system which can gather above resources periodically. There are many operation, and you can assign at most four echleons for them, without any duplication.

For example, finishing operation 5-3 will gain Manpower:Ammo:Rations:Parts = 800:400:400:0 and additionally Equipment Contract.

Finished operation **must be received** by Shikikan mannually. That's why this application exists. Everybody wants to optimize the maximum gain while reducing their time and concentration.

## Development

This project uses vanilla JavaScript (I know, I was fairly noob when I've started this) but I tried to modernize some other development tools.

```
yarn
yarn dev
```

Any suggestion is welcome! Feel free to leave issues and don't forget to mention @Phryxia.

### Production Test

Note that this script will not used for actual deployment. Netlify support static serving, and this app doesn't need to be served dynamically.

```
yarn build
yarn start
```

You may need to install http-server.

```
npm i -g http-server
```

## Inspiration

Actually there were some other services like this (ex: http://mahler83.net/sogunchu/). But these are worked with some non practical assumption- Shikikan MUST be waiting for every time to receive it. Almost every user can't do that.

I improve the algorithm to receive user's schedule so that it can produces the optimal result for each user's private pattern.

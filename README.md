# LikeMinds Chat SDK for React Native

Drop-in chat for React Native apps. Group chatrooms, 1:1 DMs, polls, voice notes and reactions, with
an offline-first local database.

[![npm](https://img.shields.io/npm/v/@likeminds.community/chat-rn-core.svg)](https://www.npmjs.com/package/@likeminds.community/chat-rn-core)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Docs:** https://docs.likeminds.io/

## What you get

Group chatrooms and 1:1 DMs with request, approve, reject, block and rate limits · emoji reactions ·
reply, edit, delete, multi-select · @-mentions · polls · voice notes · images, video, GIFs, PDFs and
documents · link previews · chatroom topics · search · explore chatrooms · secret chatrooms and
invites · report and moderation.

Beyond the shared feature set: a **Realm local database** so chat works offline and syncs on
reconnect, swipe-to-reply, and FCM with Notifee push carrying deep-link routing.

## Install

```bash
npm install @likeminds.community/chat-rn-core
```

This is the UI layer. It depends on the data layer:

```bash
npm install @likeminds.community/chat-rn
```

Source for the data layer is at
[likeminds-chat-reactnative-data](https://github.com/LikeMindsCommunity/likeminds-chat-reactnative-data).

### Optional peer dependencies

GIF support, voice-note record and playback, and clipboard are **opt-in**. Install them only if you
need those features, so apps that do not are not carrying the weight.

## What is in this repo

| Directory | What it is |
|---|---|
| `likeminds-chat-reactnative-integration/` | The publishable package |
| `community-chat/` | Group chatrooms only |
| `networking-chat/` | 1:1 DMs only |
| `community-hybrid-chat/` | Both in one app |
| `ai-chatbot/` | Chat against an AI bot participant |
| `cbc/` | A single-channel-as-community build |

## Three product shapes

Selected by theme: `COMMUNITY` for group chatrooms, `NETWORKING` for DMs, `COMMUNITY_HYBRID` for
both in one app.

## Requirements

React Native 0.71 or later.

## Built on

Realm · `@shopify/flash-list` · Firebase Cloud Messaging · Notifee · AWS S3 and Cognito

## Contributing

See the org-wide [contributing guide](https://github.com/LikeMindsCommunity/.github/blob/master/.github/CONTRIBUTING.md).
Security issues go to **hi@likeminds.community**, not the issue tracker.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

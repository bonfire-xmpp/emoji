# Emoji

## Summary

This repository processes the gemoji `emoji.json` file and generates a 64x64
(per emoji) image atlas using Twemoji bitmaps.

It also generates its own, processed `emoji.json` file, of the format:

```js
{
  "emojis": [
    {
      "emoji": "😀",
      "aliases": ["grinning"],
      "name": "grinning",
      "category": "Smileys & Emotion",
      "offset": [0, 0]
    },
    ...
  ],
  "byname": { "grinning": 0, ... },
  "byemoji": { "😀": 0, ... },
  "atlasWidth": 2064,
  "atlasHeight": 2016,
  "emojiSize": 48
}
```

The offset fields is the (x, y) offset from the top left of the image atlas.

## Credit:

This makes use of code from the following projects:

* [**gemoji**](https://github.com/github/gemoji)
* [**twemoji**](https://github.com/twitter/twemoji)
* [**twemoji-parser**](https://github.com/twitter/twemoji-parser)
* [**jimp**](https://github.com/oliver-moran/jimp)

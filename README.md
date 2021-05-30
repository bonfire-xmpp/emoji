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
      "description": "grinning face",
      "category": "Smileys & Emotion",
      "aliases": ["grinning"],
      "tags": ["smile","happy"],
      "unicode_version": "6.1",
      "ios_version": "6.0",
      "name": "grinning-face",
      "offset": [0,0]
    },
    ...
  ],
  "byname": {
    "grinning-face": {
      "emoji": "😀",
      "description": "grinning face",
      "category": "Smileys & Emotion",
      "aliases": ["grinning"],
      "tags": ["smile","happy"],
      "unicode_version": "6.1",
      "ios_version": "6.0",
      "name": "grinning-face",
      "offset": [0,0]
    },
    ...
  },
  "byemoji": {
    "😀": {
      "emoji": "😀",
      "description": "grinning face",
      "category": "Smileys & Emotion",
      "aliases": ["grinning"],
      "tags": ["smile","happy"],
      "unicode_version": "6.1",
      "ios_version": "6.0",
      "name": "grinning-face",
      "offset": [0,0]
    },
    ...
  },
  "atlasWidth": 2752,
  "atlasHeight": 2688
}
```

The offset fields is the (x, y) offset from the top left of the image atlas.

## Credit:

This makes use of code from the following projects:

* [**gemoji**](https://github.com/github/gemoji)
* [**twemoji**](https://github.com/twitter/twemoji)
* [**twemoji-parser**](https://github.com/twitter/twemoji-parser)
* [**jimp**](https://github.com/oliver-moran/jimp)

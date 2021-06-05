const Jimp = require("jimp");
const fs = require("fs");
const { parse } = require("twemoji-parser");

const kEmojiSize = 48;

const stripEmoji = ({ emoji, aliases, name, category, offset }) => ({ emoji, aliases, name, category, offset });

async function main() {
  const queue = [];
  const emojis = JSON.parse(fs.readFileSync("gemoji/db/emoji.json").toString("utf-8"));
  for (const e of emojis) {
    e.name = e.aliases[0];
    queue.push(parse(e.emoji, {
      assetType: "png",
      buildUrl: (codepoints, assetType) => `${codepoints}.${assetType}`,
    })[0].url);
  }
  
  const numPerRow = Math.ceil(Math.sqrt(queue.length));
  const numRows = Math.ceil(queue.length / numPerRow);
  const padding = 2;
  const images = await Promise.all(queue.map(file => Jimp.read("twemoji/assets/72x72/" + file).then(image => image.resize(kEmojiSize, kEmojiSize))));
  const image = await new Promise(async resolve => 
    new Jimp(numPerRow * (kEmojiSize + padding), numRows * (kEmojiSize + padding), 0x00000000, async (err, image) => {
      images.forEach((src, i) => {
        const offset = [(i % numPerRow) * (kEmojiSize + padding), Math.floor(i / numPerRow) * (kEmojiSize + padding)];
        image.blit(src, ...offset);
        emojis[i].offset = offset;
      });
      await image.writeAsync("./dist/atlas.png");
      resolve(image);
    }
  ));
  
  const byname = {};
  const byemoji = {};
  for (const [i, e] of emojis.entries()) {
    for (const alias of e.aliases) {
      byname[alias] = i;
    }
    byemoji[e.emoji] = i;
  }
  fs.writeFileSync("./dist/emoji.json", JSON.stringify({
    byname,
    byemoji,
    emojis: emojis.map(stripEmoji),
    atlasWidth: image.bitmap.width,
    atlasHeight: image.bitmap.height,
    emojiSize: kEmojiSize,
  }));
}

if (!fs.existsSync("./dist") || !fs.statSync("./dist").isDirectory()) 
  fs.mkdirSync("./dist");

main();

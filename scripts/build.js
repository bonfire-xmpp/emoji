const Jimp = require("jimp");
const fs = require("fs");
const { parse } = require("twemoji-parser");

const tokebab = x => x.replaceAll(/\s+/g, "-").toLowerCase();

const kEmojiSize = 48;

async function main() {
  const queue = [];
  const emojis = JSON.parse(fs.readFileSync("gemoji/db/emoji.json").toString("utf-8"));
  for (const e of emojis) {
    e.name = tokebab(e.description);
    queue.push(parse(e.emoji, {
      assetType: "png",
      buildUrl: (codepoints, assetType) => `${codepoints}.${assetType}`,
    })[0].url);
  }
  
  const numPerRow = Math.ceil(Math.sqrt(queue.length));
  const numRows = Math.ceil(queue.length / numPerRow);
  const images = await Promise.all(queue.map(file => Jimp.read("twemoji/assets/72x72/" + file).then(image => image.resize(kEmojiSize, kEmojiSize))));
  const image = await new Promise(async resolve => 
    new Jimp(numPerRow * kEmojiSize, numRows * kEmojiSize, 0x00000000, async (err, image) => {
      images.forEach((src, i) => {
        const offset = [(i % numPerRow) * kEmojiSize, Math.floor(i / numPerRow) * kEmojiSize];
        image.blit(src, ...offset);
        emojis[i].offset = offset;
      });
      await image.write("./dist/atlas.png", () => resolve(image));
    }
  ));
  
  const byname = {};
  const byemoji = {};
  for (const e of emojis) {
    byname[e.name] = e;
    byemoji[e.emoji] = e;
  }
  fs.writeFileSync("./dist/emoji.json", JSON.stringify({
    byname,
    byemoji,
    emojis,
    atlasWidth: image.bitmap.width,
    atlasHeight: image.bitmap.height,
    emojiSize: kEmojiSize,
  }));
}

if (!fs.existsSync("./dist") || !fs.statSync("./dist").isDirectory()) 
  fs.mkdirSync("./dist");

main();

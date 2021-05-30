const Jimp = require("jimp");
const fs = require("fs");
const { parse } = require("twemoji-parser");

const tokebab = x => x.replaceAll(/\s+/g, "-").toLowerCase();

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
  const images = await Promise.all(queue.map(file => Jimp.read("twemoji/assets/72x72/" + file).then(image => image.resize(64, 64))));
  const image = await new Promise(async resolve => 
    new Jimp(numPerRow * 64, numRows * 64, 0x00000000, async (err, image) => {
      images.forEach((src, i) => {
        const offset = [(i % numPerRow) * 64, Math.floor(i / numPerRow) * 64];
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
  }));
}

if (!fs.existsSync("./dist") || !fs.statSync("./dist").isDirectory()) 
  fs.mkdirSync("./dist");

main();

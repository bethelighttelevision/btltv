import sharp from "sharp";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const QUALITY = 80;
const WIDTH = 640;

async function compress() {
  const dir = "public/images/programs";
  const files = readdirSync(dir).filter(f => f.endsWith(".webp")).map(f => join(dir, f));
  for (const file of files) {
    const buf = readFileSync(file);
    const meta = await sharp(buf).metadata();
    if (meta.width && meta.width > WIDTH) {
      const out = await sharp(buf)
        .resize(WIDTH, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();
      writeFileSync(file, out);
      const saved = ((buf.length - out.length) / buf.length * 100).toFixed(1);
      console.log(`✓ ${file.split("/").pop()}: ${(buf.length/1024).toFixed(1)}KB → ${(out.length/1024).toFixed(1)}KB (${saved}% saved)`);
    } else {
      console.log(`- ${file.split("/").pop()}: already ${meta.width}x${meta.height}`);
    }
  }
}

compress().catch(console.error);

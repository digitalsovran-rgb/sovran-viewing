import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.resolve(__dirname, '../public/media');
const QUALITY = 80;

async function main() {
  const entries = await readdir(IMAGE_DIR);
  const pngFiles = entries.filter((f) => f.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log(`No .png files found in ${IMAGE_DIR}`);
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(IMAGE_DIR, file);
    const outputName = file.replace(/\.png$/i, '.webp');
    const outputPath = path.join(IMAGE_DIR, outputName);

    if (existsSync(outputPath)) {
      console.log(`Skipped (already exists): ${file} -> ${outputName}`);
      skipped++;
      continue;
    }

    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
    console.log(`Converted: ${file} -> ${outputName}`);
    converted++;
  }

  console.log(`\nDone. ${converted} converted, ${skipped} skipped, ${pngFiles.length} total .png files found.`);
}

main().catch((err) => {
  console.error('Conversion failed:', err);
  process.exitCode = 1;
});

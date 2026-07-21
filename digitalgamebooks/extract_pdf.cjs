const fs = require('fs');
const path = require('path');

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');

  const data = new Uint8Array(fs.readFileSync('Big.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log('Pages:', doc.numPages);

  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
    if (i <= 5) console.log(`Page ${i}:`, pageText.substring(0, 200));
  }

  fs.writeFileSync('pdf_extracted.txt', fullText, 'utf8');
  console.log('Done! Saved to pdf_extracted.txt');
}

main().catch(console.error);

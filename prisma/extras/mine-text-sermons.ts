import { JSDOM } from 'jsdom';

async function getTextSermons(id: number) {
  const url = `https://www.sermonindex.net/modules/articles/index.php?view=article&aid=${id}`;
  const html = await (await fetch(url)).text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  let table = document.querySelector('table.bg1');
  if (table) {
    let firstAnchor = document.querySelector(
      `a[href='https://img.sermonindex.net/modules/articles/article_pdf.php?aid=${id}']`,
    );

    let content = [];

    let currentNode: any = firstAnchor;
    while (currentNode) {
      if (currentNode.textContent == 'Open as PDF') {
        currentNode = currentNode.nextSibling;
        continue;
      }

      content.push(currentNode.textContent);
      currentNode = currentNode.nextSibling;
    }

    let result = content.join(' ').trim();

    console.log(result);
  }
}

getTextSermons(30737).then(() => {
  console.log('done');
});

// ('â€” , × , ©, ª');

browser.browserAction.onClicked.addListener(async tab => {
  try {
    await browser.tabs.executeScript({
      file: 'exam-parser.js',
    });
  } catch (e: unknown) {
    console.log(e);
  }
});

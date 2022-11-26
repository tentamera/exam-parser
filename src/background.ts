browser.browserAction.onClicked.addListener(async tab => {
  try {
    // browser.runtime.reload();

    // const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    // if (activeTab?.id) {
    //   await browser.tabs.reload(activeTab.id);
    // }

    const executing = browser.tabs.executeScript({
      file: 'exam-parser.js',
    });
  } catch (e: unknown) {
    console.log(e);
  }
});

browser.browserAction.onClicked.addListener(tab => {
  browser.runtime.reload();

  // const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  // if (activeTab?.id) {
  //   await browser.tabs.reload(activeTab.id);
  // }
});

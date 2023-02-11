var cock = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  getCookies().then((v) => {

    sendResponse(v);
  });
  return true;
});

/*
async function get() {
  await chrome.cookies.getAll({}, function (theCookies) {
    cookies = theCookies;
    return cookies;
  });
} */

async function getCookies() {
  const domain = "https://www.linkedin.com/";
  const cookies = await chrome.cookies.getAll({});
  return cookies;
}

/*
async function get() {
  let val = [];
  await chrome.cookies.getAll({}, function (theCookies) {
    val.push(theCookies);
  });
  console.log(val);
  return val;
} 

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log("SE EJECT 2?");
  if (request) {
    if (request.message) {
      if (request.message == "version") {
        sendResponse({ version: 1.0 });
      }
    }
  }
  return true;
});
*/

chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    console.log(cs, "CORRE");
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      console.log(tab, "CORRE2");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: cs.js,
      });
    }
  }
});

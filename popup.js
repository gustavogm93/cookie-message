const form = document.getElementById("control-row");
const go = document.getElementById("go");
const input = document.getElementById("input");
const message = document.getElementById("message");

const specificCookies = [
  { name: "bcookie", withComillas: true },
  { name: "lidc", withComillas: true },
  { name: "JSESSIONID", withComillas: true },
  { name: "bscookie", withComillas: true },
  { name: "li_at", withComillas: false },
];

var message2 = "";
var message3 = [];
var splitter =
  "---*****-----*****.....-------*****-----*****.....-------*****-----*****.....-------*****-----*****.....----";
// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      input.value = url.hostname;
    } catch {}
  }

  input.focus();
})();

form.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  /* return;
  event.preventDefault();

  clearMessage();

  const url = "https://www.linkedin.com/";
  let message = await deleteDomainCookies(url);
  const finalJsonResponse = normalizeMessage(message3);
  navigator.clipboard.writeText(finalJsonResponse);

  setMessage(finalJsonResponse);
  */
}

function stringToUrl(input) {
  // Start with treating the provided value as a URL
  try {
    return new URL(input);
  } catch {}
  // If that fails, try assuming the provided input is an HTTP host
  try {
    return new URL("http://" + input);
  } catch {}
  // If that fails ¯\_(ツ)_/¯
  return null;
}

function alertar(cookie) {
  alert(cookie);
}

async function deleteDomainCookies(domain) {
  let cookiesDeleted = 0;
  let res = "";
  try {
    const cookies = await chrome.cookies.getAll({ domain });

    if (cookies.length === 0) {
      return "No cookies found";
    }

    cookies.map(deleteCookie);
  } catch (error) {
    return `Unexpected error: ${error.message}`;
  }

  return `get ${res} cookie(s).----------`;
}

function deleteCookie(cookie) {
  // Cookie deletion is largely modeled off of how deleting cookies works when using HTTP headers.
  // Specific flags on the cookie object like `secure` or `hostOnly` are not exposed for deletion
  // purposes. Instead, cookies are deleted by URL, name, and storeId. Unlike HTTP headers, though,
  // we don't have to delete cookies by setting Max-Age=0; we have a method for that ;)
  //
  // To remove cookies set with a Secure attribute, we must provide the correct protocol in the
  // details object's `url` property.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Secure
  const protocol = cookie.secure ? "https:" : "http:";

  // Note that the final URL may not be valid. The domain value for a standard cookie is prefixed
  // with a period (invalid) while cookies that are set to `cookie.hostOnly == true` do not have
  // this prefix (valid).
  // https://developer.chrome.com/docs/extensions/reference/cookies/#type-Cookie
  const cookieUrl = "https://www.linkedin.com/"; //`${protocol}//${cookie.domain}${cookie.path}`;

  message2 += JSON.stringify(cookie);
  message3.push(normalizeCookie(cookie));
  /*
  return chrome.cookies.get({
    name: cookie.name,
    storeId: cookie.storeId,
    url: cookieUrl,
  });
  */
}

function setMessage(str) {
  message.textContent = str;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = "";
}

function normalizeCookie(cookies) {
  const { name, value } = cookies;
  if (!name || !value) return;

  const settingsCookieValues = specificCookies.filter((v) => v.name === name);

  if (!settingsCookieValues) return;

  let comilla = settingsCookieValues.withComillas ? `"` : "";

  return `${name}=${comilla}${value}${comilla}`;
}

function normalizeMessage(messageArray) {
  return `'${messageArray.join(";")}'`;
}

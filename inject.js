//Enviar cookies
document.addEventListener(
  "yourEventName",
  function (e) {
    chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
      console.log(response);

      navigator.clipboard.writeText("COOKIES GUARDADAS");
      window.postMessage({ type: "FROM_CONTENT", text: response }, "*");
    });
  },
  false
);

//Si esta instalado previamente.

function isInstalled() {
  document.body.setAttribute("is-extension-installed", true);
  window.postMessage({ type: "FROM_CONTENT", text: "is installed" }, "*");
}
isInstalled();

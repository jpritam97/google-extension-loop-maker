// Background script for Simple Auto Clicker Loop
chrome.action.onClicked.addListener((tab) => {
  // Inject the floating panel when extension icon is clicked
  chrome.tabs.sendMessage(tab.id, {action: "showPanel"});
}); 
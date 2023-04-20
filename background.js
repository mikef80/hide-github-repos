chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
  chrome.action.setBadgeTextColor({
    color: "white",
  });
  chrome.action.setBadgeBackgroundColor({
    color: "red",
  });
});

const regex = /https:\/\/github.com\/.+tab=repositories/gim;
const githubRepos = `https://github.com/mikef80?tab=repositories`;

chrome.action.onClicked.addListener(async (tab) => {
  let validTabURL = await tab.url.match(regex);

  if (validTabURL) {
    // Retrive the action bade to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";
    const nextStateColour = prevState === "ON" ? "red" : "green";

    // Set the action badge to the next state
    chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    // Set the action badge colour to the next state
    chrome.action.setBadgeBackgroundColor({
      tabId: tab.id,
      color: nextStateColour,
    });

    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    }
  }
});

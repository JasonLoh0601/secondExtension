/*
This file is use to set an alarm. the game web page will come out when timeout.
Normally, the alram will set 1 mininute. if the user is inactivity then the web page will come out.
*/
var DELAY = 0.1;
var CATGIFS = "index.html";

/*
Restart alarm for the currently active tab, whenever index.html is run.
*/
var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
gettingActiveTab.then((tabs) => {
  restartAlarm(tabs[0].id);
});

/*
Restart alarm for the currently active tab, whenever the user navigates.
*/
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    if (tabId == tabs[0].id) {
      restartAlarm(tabId);
    }
  });
});

/*
Restart alarm for the currently active tab, whenever a new tab becomes active.
*/
browser.tabs.onActivated.addListener((activeInfo) => {
  restartAlarm(activeInfo.tabId);
});

/*
restartAlarm: clear all alarms,
then set a new alarm for the given tab.
*/
function restartAlarm(tabId) {
  browser.pageAction.hide(tabId);
  browser.alarms.clearAll();
  var gettingTab = browser.tabs.get(tabId);
  gettingTab.then((tab) => {
    if (!tab.url.includes(CATGIFS)) {
      browser.alarms.create("", {delayInMinutes: DELAY});
    }
  });
}

/*
On alarm, show the page action.
*/
browser.alarms.onAlarm.addListener((alarm) => {

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
          browser.tabs.create({url: CATGIFS});
          browser.pageAction.show(tabs[0].id);
  });
});

/*
On page action click, navigate the corresponding tab to the cat gifs.
*/
browser.pageAction.onClicked.addListener(() => {
  browser.tabs.create({url: CATGIFS});
});

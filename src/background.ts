import { INITIAL_OPTION_VALUES } from "./constant";
import {
  escapeBrackets,
  copyTemplateToClipboard,
  buildTemplate,
  copyToClipboard,
} from "./util";

chrome.commands.onCommand.addListener((command) => {
  console.log("Command:", command);

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    // All commands are like `copy_as_format_*` (*: 1 or 2 or 3)
    const formatIndex = command.slice(-1);
    console.log("format: ", formatIndex);

    const key = `optionalFormat${formatIndex}`;
    chrome.storage.local.get(INITIAL_OPTION_VALUES, function (options) {
      const tab = tabs[0];
      const title = tab.title || "";
      const url = tab.url || "";
      const tabId = tab.id || 0;

      console.log(tab.url, tab.title);
      console.log(options);

      const replaced = buildTemplate(options[key], title, escapeBrackets(url));

      chrome.scripting.executeScript({
        target: { tabId },
        func: copyToClipboard,
        args: [replaced],
      });

      chrome.action.setBadgeText({ text: formatIndex });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 1000);

      console.log("done!");
    });
  });
});

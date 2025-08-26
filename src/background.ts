import { INITIAL_OPTION_VALUES } from "./constant";
import { buildTemplate, copyToClipboard, escapeBrackets } from "./util";

function executeCopy(
  options: any,
  commandKey: string,
  tab: chrome.tabs.Tab,
  title: string
) {
  const url = tab.url || "";
  const tabId = tab.id || 0;
  const formatIndex = commandKey.slice(-1);

  console.log("Using title:", title);
  console.log("Using options:", options);

  const replaced = buildTemplate(
    options[commandKey],
    title,
    escapeBrackets(url)
  );

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
}

chrome.commands.onCommand.addListener((command) => {
  console.log("Command:", command);

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    const tab = tabs[0];
    if (!tab || !tab.id) {
      return;
    }
    // All commands are like `copy_as_format_*` (*: 1 or 2 or 3)
    const formatIndex = command.slice(-1);
    console.log("format: ", formatIndex);

    const commandKey = `optionalFormat${formatIndex}`;

    chrome.storage.local.get(INITIAL_OPTION_VALUES, function (options) {
      // Content Scriptにカスタムタイトルを問い合わせ
      chrome.tabs.sendMessage(
        tab.id!,
        { type: "GET_CUSTOM_TITLE", rules: options.siteSpecificRules || [] },
        (response) => {
          // Content Scriptが注入されていないページなどでエラーになる場合がある
          if (chrome.runtime.lastError) {
            console.log(
              "Could not establish connection. Using tab.title as a fallback.",
              chrome.runtime.lastError.message
            );
            executeCopy(options, commandKey, tab, tab.title || "");
            return;
          }

          const customTitle = response?.title;
          const originalTitle = tab.title || "";

          // カスタムタイトルがあれば元のタイトルと結合し、なければ元のタイトルをそのまま使う
          const titleToUse = customTitle
            ? `${customTitle} | ${originalTitle}`
            : originalTitle;

          executeCopy(options, commandKey, tab, titleToUse);
        }
      );
    });
  });
});

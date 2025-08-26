import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup";
import { escapeBrackets, copyTemplateToClipboard } from "../util";
import { INITIAL_OPTION_VALUES } from "../constant";

const queryInfo = {
  active: true,
  currentWindow: true,
};

function renderPopupAndCopy(format: string, title: string, url: string) {
  const escapedUrl = escapeBrackets(url);
  copyTemplateToClipboard(format, title, escapedUrl);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Popup title={title} url={escapedUrl} />
    </React.StrictMode>
  );
}

chrome.tabs.query(queryInfo, function (tabs) {
  const tab = tabs[0];
  if (!tab || !tab.id) {
    return;
  }

  // storage.localからすべての設定を取得
  chrome.storage.local.get(INITIAL_OPTION_VALUES, function (options) {
    // Content Scriptにカスタムタイトルを問い合わせ
    chrome.tabs.sendMessage(
      tab.id!,
      { type: "GET_CUSTOM_TITLE", rules: options.siteSpecificRules || [] },
      (response) => {
        // Content Scriptからの応答がない場合のエラーハンドリング
        if (chrome.runtime.lastError) {
          console.log(
            "Could not establish connection. Using tab.title as a fallback.",
            chrome.runtime.lastError.message
          );
          renderPopupAndCopy(options.format, tab.title || "", tab.url || "");
          return;
        }

        const customTitle = response?.title;
        const originalTitle = tab.title || "";

        // カスタムタイトルがあれば元のタイトルと結合し、なければ元のタイトルをそのまま使う
        const titleToUse = customTitle
          ? `${customTitle} | ${originalTitle}`
          : originalTitle;

        renderPopupAndCopy(options.format, titleToUse, tab.url || "");
      }
    );
  });
});

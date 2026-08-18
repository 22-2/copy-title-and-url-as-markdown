import "../../components/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "../../components/popup/Popup";
import {
  appendTitleSuffix,
  escapeBrackets,
  escapeHashtags,
  copyToClipboard,
} from "../../components/util";
import { INITIAL_OPTION_VALUES } from "../../components/constant";
import type { OptionsType } from "../../components/options/Options";
import { applyTheme } from "../../components/theme";

const queryInfo = {
  active: true,
  currentWindow: true,
};

async function main() {
  const tabs = await browser.tabs.query(queryInfo);
  const options = (await browser.storage.local.get(INITIAL_OPTION_VALUES)) as OptionsType;
  applyTheme(options.theme);
  const tab = tabs[0];
  const url = tab.url || "";
  const titleWithSuffix = appendTitleSuffix(tab.title || "", url, options.titleSuffixRules);
  const title = options.escapeHashtags ? escapeHashtags(titleWithSuffix) : titleWithSuffix;
  copyToClipboard(options.format, title, escapeBrackets(url));

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Popup title={title} url={escapeBrackets(url)} />
    </React.StrictMode>,
  );
}

main();

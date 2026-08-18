import type { TitleSuffixRule } from "./options/Options";

export function escapeTabsAndNewLines(str: string) {
  return str.replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

export function unescapeTabsAndNewLines(str: string) {
  return str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

export function escapeBrackets(str: string) {
  return str
    .replace(/\(/g, escape)
    .replace(/\)/g, escape)
    .replace(/\[/g, escape)
    .replace(/\]/g, escape);
}

export function escapeHashtags(str: string) {
  return str.replace(/#/g, "\\#");
}

function matchesUrlPattern(urlPattern: string, url: string) {
  if (!urlPattern) {
    return false;
  }

  const escapedPattern = urlPattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escapedPattern}$`).test(url);
}

export function appendTitleSuffix(title: string, url: string, rules: TitleSuffixRule[]) {
  const matchingRule = rules.find((rule) => matchesUrlPattern(rule.urlPattern, url));
  return matchingRule ? `${title}${matchingRule.suffix}` : title;
}

export function buildTemplate(template: string, title: string, url: string) {
  return template.replaceAll("${title}", title).replaceAll("${url}", url);
}

export function copyToClipboard(template: string, title: string, url: string) {
  console.log("copyToClipboard", template, title, url);

  const textToCopy = buildTemplate(template, title, url);

  const listener = (event: any) => {
    event.clipboardData.setData("text/plain", `${textToCopy}`);
    event.preventDefault();
  };
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);

  console.log("Successfully copied to clipboard: " + textToCopy);
}

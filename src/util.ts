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

export function buildTemplate(template: string, title: string, url: string) {
  return template.replaceAll("${title}", title).replaceAll("${url}", url);
}

export function copyTemplateToClipboard(
  template: string,
  title: string,
  url: string
) {
  console.log("copyTemplateToClipboard", template, title, url);

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

export function copyToClipboard(str: string) {
  console.log("copyToClipboard", str);
  navigator.clipboard.writeText(str);
  console.log("Successfully copied to clipboard: " + str);
}

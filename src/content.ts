type SiteSpecificRule = {
  urlPattern: string;
  selector: string;
};

// Listen for messages from other parts of the extension (e.g., background script, popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_CUSTOM_TITLE") {
    const rules: SiteSpecificRule[] = request.rules || [];
    const currentUrl = window.location.href;

    // Find the first rule that matches the current URL
    const matchedRule = rules.find((rule) => {
      if (!rule.urlPattern || !rule.selector) {
        return false;
      }
      try {
        // Convert wildcard `*` to `.*` and create a RegExp to test against the current URL
        const regex = new RegExp(
          "^" + rule.urlPattern.replace(/\*/g, ".*") + "$"
        );
        return regex.test(currentUrl);
      } catch (e) {
        console.error("Invalid URL pattern as regex:", rule.urlPattern, e);
        return false;
      }
    });

    if (matchedRule) {
      const element = document.querySelector(matchedRule.selector);
      if (element && element.textContent) {
        // If an element is found, send its text content back as the title
        sendResponse({ title: element.textContent.trim() });
        return true; // Indicates that the response will be sent asynchronously
      }
    }

    // If no rule matches or the element is not found, send back null
    sendResponse({ title: null });
  }

  // Return true to indicate you wish to send a response asynchronously
  return true;
});

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { unescapeTabsAndNewLines, escapeTabsAndNewLines } from "../util";
import { INITIAL_OPTION_VALUES } from "../constant";
import { type Theme, applyTheme } from "../theme";

export type OptionsType = {
  format: string;
  optionalFormat1: string;
  optionalFormat2: string;
  theme: Theme;
  escapeHashtags: boolean;
  titleSuffixRules: TitleSuffixRule[];
};

export type TitleSuffixRule = {
  urlPattern: string;
  suffix: string;
};

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
];

export const Options: React.FC = () => {
  const [options, setOptions] = useState<OptionsType>({
    format: "",
    optionalFormat1: "",
    optionalFormat2: "",
    theme: "system",
    escapeHashtags: false,
    titleSuffixRules: [],
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const savedOptions = (await browser.storage.local.get(INITIAL_OPTION_VALUES)) as OptionsType;
      setOptions({
        format: escapeTabsAndNewLines(savedOptions.format),
        optionalFormat1: escapeTabsAndNewLines(savedOptions.optionalFormat1),
        optionalFormat2: escapeTabsAndNewLines(savedOptions.optionalFormat2),
        theme: savedOptions.theme ?? "system",
        escapeHashtags: savedOptions.escapeHashtags ?? false,
        titleSuffixRules: savedOptions.titleSuffixRules ?? [],
      });
    };
    loadOptions();
  }, []);

  useEffect(() => {
    applyTheme(options.theme);

    if (options.theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [options.theme]);

  const handleChange = <K extends keyof OptionsType>(key: K, value: OptionsType[K]) => {
    setOptions({ ...options, [key]: value });
  };

  const updateTitleSuffixRule = (index: number, key: keyof TitleSuffixRule, value: string) => {
    const titleSuffixRules = [...options.titleSuffixRules];
    titleSuffixRules[index] = { ...titleSuffixRules[index], [key]: value };
    handleChange("titleSuffixRules", titleSuffixRules);
  };

  const addTitleSuffixRule = () => {
    handleChange("titleSuffixRules", [...options.titleSuffixRules, { urlPattern: "", suffix: "" }]);
  };

  const removeTitleSuffixRule = (index: number) => {
    handleChange(
      "titleSuffixRules",
      options.titleSuffixRules.filter((_, ruleIndex) => ruleIndex !== index),
    );
  };

  const onSave = async () => {
    await browser.storage.local.set({
      format: unescapeTabsAndNewLines(options.format),
      optionalFormat1: unescapeTabsAndNewLines(options.optionalFormat1),
      optionalFormat2: unescapeTabsAndNewLines(options.optionalFormat2),
      theme: options.theme,
      escapeHashtags: options.escapeHashtags,
      titleSuffixRules: options.titleSuffixRules
        .filter((rule) => rule.urlPattern.trim() && rule.suffix)
        .map((rule) => ({ ...rule, urlPattern: rule.urlPattern.trim() })),
    });
    setShowToast(true);
  };

  return (
    <div className="mx-auto mt-8 w-[300px] text-gray-900 dark:text-gray-100">
      {showToast && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900 dark:text-green-100">
          <span>Successfully Saved.</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-green-600 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
          >
            ✕
          </button>
        </div>
      )}
      <h1 className="mb-2 text-lg font-semibold">Options</h1>
      <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        You can use <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">\n</code> for new
        lines, and <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">\t</code> for tabs.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Theme</Label>
          <div className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
            {THEME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange("theme", value)}
                className={`flex-1 py-1.5 text-sm transition-colors ${
                  options.theme === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="format">Format</Label>
          <Input
            id="format"
            onChange={(e) => handleChange("format", e.target.value)}
            value={options.format}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="optionalFormat1">Optional Format #1</Label>
          <Input
            id="optionalFormat1"
            onChange={(e) => handleChange("optionalFormat1", e.target.value)}
            value={options.optionalFormat1}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="optionalFormat2">Optional Format #2</Label>
          <Input
            id="optionalFormat2"
            onChange={(e) => handleChange("optionalFormat2", e.target.value)}
            value={options.optionalFormat2}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={options.escapeHashtags}
            onChange={(event) => handleChange("escapeHashtags", event.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Disable hashtags by adding \ before them
        </label>
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div>
            <Label>Title suffix rules</Label>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Add text to titles for matching URLs. Use * as a wildcard.
            </p>
          </div>
          {options.titleSuffixRules.map((rule, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-700"
            >
              <Input
                aria-label={`URL pattern ${index + 1}`}
                placeholder="URL pattern (e.g. https://chatgpt.com/c/*)"
                value={rule.urlPattern}
                onChange={(event) => updateTitleSuffixRule(index, "urlPattern", event.target.value)}
              />
              <Input
                aria-label={`Title suffix ${index + 1}`}
                placeholder="Suffix (e.g.  - ChatGPT)"
                value={rule.suffix}
                onChange={(event) => updateTitleSuffixRule(index, "suffix", event.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTitleSuffixRule(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addTitleSuffixRule}>
            Add title suffix rule
          </Button>
        </div>
        <Button className="mt-2" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

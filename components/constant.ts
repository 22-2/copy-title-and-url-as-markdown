import type { OptionsType, TitleSuffixRule } from "./options/Options";

// markdown style
export const DEFAULT_FORMAT = "[${title}](${url})";

export const DEFAULT_TITLE_SUFFIX_RULES: TitleSuffixRule[] = [
  { urlPattern: "https://chatgpt.com/c/*", suffix: " - ChatGPT" },
];

export const INITIAL_OPTION_VALUES: OptionsType = {
  format: DEFAULT_FORMAT,
  optionalFormat1: "",
  optionalFormat2: "",
  theme: "system",
  escapeHashtags: false,
  titleSuffixRules: DEFAULT_TITLE_SUFFIX_RULES,
};

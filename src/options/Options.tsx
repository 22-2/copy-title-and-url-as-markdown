import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Space, Typography, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { unescapeTabsAndNewLines, escapeTabsAndNewLines } from "../util";
import { INITIAL_OPTION_VALUES } from "../constant";

import "./Options.css";

const { Text } = Typography;

export type SiteSpecificRule = {
  urlPattern: string;
  selector: string;
};

export type OptionsType = {
  format: string;
  optionalFormat1: string;
  optionalFormat2: string;
  siteSpecificRules: SiteSpecificRule[];
};

export const Options: React.FC = () => {
  const [options, setOptions] = useState<OptionsType>({
    format: "",
    optionalFormat1: "",
    optionalFormat2: "",
    siteSpecificRules: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    chrome.storage.local.get(INITIAL_OPTION_VALUES, (savedOptions) => {
      const escapedOptions = {
        format: escapeTabsAndNewLines(savedOptions.format),
        optionalFormat1: escapeTabsAndNewLines(savedOptions.optionalFormat1),
        optionalFormat2: escapeTabsAndNewLines(savedOptions.optionalFormat2),
        siteSpecificRules: savedOptions.siteSpecificRules || [],
      };

      setOptions(escapedOptions);
      form.setFieldsValue(escapedOptions); // フォームの初期値を設定
    });
  }, [form]);

  const onSave = () => {
    form
      .validateFields()
      .then((values) => {
        const unescapedValues = {
          format: unescapeTabsAndNewLines(values.format),
          optionalFormat1: unescapeTabsAndNewLines(values.optionalFormat1),
          optionalFormat2: unescapeTabsAndNewLines(values.optionalFormat2),
          siteSpecificRules: (values.siteSpecificRules || []).filter(
            (r: SiteSpecificRule) => r && r.urlPattern && r.selector
          ),
        };

        chrome.storage.local.set(unescapedValues, () => {
          setShowToast(true);
        });
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
      });
  };

  return (
    <div className="optionsContainer">
      {showToast && (
        <Alert
          message="Successfully Saved."
          type="success"
          closable
          onClose={() => setShowToast(false)}
          style={{ marginBottom: 16 }}
        />
      )}
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Text strong style={{ fontSize: "1.2em" }}>
          Options
        </Text>
        <div>
          You can use <code>\n</code> for new lines, and <code>\t</code> for
          tabs.
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Format"
            name="format"
            rules={[{ required: true, message: "Please input format!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Optional Format #1" name="optionalFormat1">
            <Input />
          </Form.Item>
          <Form.Item label="Optional Format #2" name="optionalFormat2">
            <Input />
          </Form.Item>

          <Divider />
          <Text strong style={{ fontSize: "1.2em" }}>
            Site-specific Rules
          </Text>
          <div>
            Specify a CSS selector to get the title for a specific site. <br />
            URL Pattern can use <code>*</code> as a wildcard.
          </div>
          <Form.List name="siteSpecificRules">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "urlPattern"]}
                      rules={[
                        { required: true, message: "Missing URL pattern" },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="URL Pattern (e.g., https://*.example.com/*)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "selector"]}
                      rules={[
                        { required: true, message: "Missing CSS selector" },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="CSS Selector (e.g., h1.title)" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Rule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" onClick={onSave}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

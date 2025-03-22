import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Space, Typography } from "antd";
import { unescapeTabsAndNewLines, escapeTabsAndNewLines } from "../util";
import { INITIAL_OPTION_VALUES } from "../constant";

import "./Options.css"; // Ant Design のスタイルに合うように調整が必要

const { Text } = Typography;

export type OptionsType = {
  format: string;
  optionalFormat1: string;
  optionalFormat2: string;
};

export const Options: React.FC = () => {
  const [options, setOptions] = useState<OptionsType>({
    format: "",
    optionalFormat1: "",
    optionalFormat2: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [form] = Form.useForm();


  useEffect(() => {
    chrome.storage.local.get(INITIAL_OPTION_VALUES, (savedOptions) => {
      const escapedOptions = {
        format: escapeTabsAndNewLines(savedOptions.format),
        optionalFormat1: escapeTabsAndNewLines(savedOptions.optionalFormat1),
        optionalFormat2: escapeTabsAndNewLines(savedOptions.optionalFormat2),
      };

      setOptions(escapedOptions);
      form.setFieldsValue(escapedOptions); // フォームの初期値を設定
    });
  }, [form]);


  const onSave = () => {
    form.validateFields()
      .then(values => {

        const unescapedValues = {
          format: unescapeTabsAndNewLines(values.format),
          optionalFormat1: unescapeTabsAndNewLines(values.optionalFormat1),
          optionalFormat2: unescapeTabsAndNewLines(values.optionalFormat2),
        };

        chrome.storage.local.set(unescapedValues, () => {
            setShowToast(true);
        });
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
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
              style={{marginBottom: 16}}
            />
        )}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text strong style={{ fontSize: '1.2em'}}>Options</Text>
        <div>
          You can use <code>\n</code> for new lines, and <code>\t</code> for tabs.
        </div>
        <Form form={form} layout="vertical" >
          <Form.Item
            label="Format"
            name="format"
            rules={[{ required: true, message: 'Please input format!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Optional Format #1"
            name="optionalFormat1"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Optional Format #2"
            name="optionalFormat2"
          >
            <Input />
          </Form.Item>
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

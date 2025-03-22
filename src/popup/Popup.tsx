import React from "react";
import { Typography, Space, Divider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import "./Popup.css"; // Ant Design のスタイルに合うように調整が必要

const { Title, Text, Link } = Typography;

type Props = {
  title: string;
  url: string;
};

export const Popup: React.FC<Props> = ({ title, url }) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space>
        <CheckCircleOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
      </Space>

      <Title level={4} style={{ margin: 0, textAlign: "center" }}>
        {title}
      </Title>

      <Text style={{ wordBreak: "break-all" }}>{url}</Text>
    </Space>
  );
};

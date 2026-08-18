import { CheckCircle2 } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  url: string;
};

export const Popup: React.FC<Props> = ({ title, url }) => {
  return (
    <div className="flex w-[400px] flex-col gap-2 bg-white p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex justify-center">
        <CheckCircle2 className="text-green-500" size={32} />
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="break-all text-xs text-gray-500 dark:text-gray-400">{url}</div>
    </div>
  );
};

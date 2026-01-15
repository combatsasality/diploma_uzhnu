import { FC, useEffect } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { Text } from "components";
import { Flex } from "antd";
import { FileImageOutlined } from "@ant-design/icons/lib";

export const FileViewer: FC = () => {
  const [{ opacity }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop: (item: { files: File[] }) => {
      const f = item.files[0] as File & { path?: string };
      console.log("absolute", f.path);
    },
    collect: (monitor) => ({
      opacity: monitor.isOver() ? 0.5 : 1,
    }),
  }));

  return drop(
    <div className="w-full h-full" style={{ opacity }}>
      <Flex
        justify="center"
        align="center"
        orientation="vertical"
        className="w-full h-full"
        gap={8}
      >
        <FileImageOutlined className="text-6xl" />
        <Text className="text-2xl!" tx="fileViewer.noFiles" />
      </Flex>
    </div>
  );
};

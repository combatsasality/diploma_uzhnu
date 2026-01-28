import { FC } from "react";
import { FileOutlined } from "@ant-design/icons";
import { useDrag } from "react-dnd";

import { Text } from "./Text";

export interface FileWithUrls {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  absolutePath: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
}

interface FileCardProps {
  file: FileWithUrls;
}

export const FileCard: FC<FileCardProps> = ({ file }) => {
  const formatText = (text: string) => {
    return text.length > 20 ? text.slice(0, 17) + "..." : text;
  };
  const [{ opacity }, drag] = useDrag<
    FileWithUrls,
    unknown,
    { opacity: number }
  >(
    () => ({
      type: "file",
      item: { ...file },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [file],
  );

  return drag(
    <div
      key={file.id}
      className="flex flex-col min-w-41 min-h-29 justify-center content-center border border-gray-200 rounded-lg bg-white shadow-sm"
      style={{ opacity }}
    >
      <div className="self-center min-h-20 content-center p-2">
        {file.thumbnailUrl ? (
          <img
            className="max-w-30 max-h-17 rounded border"
            src={file.thumbnailUrl}
            alt={file.filename}
          />
        ) : (
          <FileOutlined className="text-4xl " />
        )}
      </div>
      <Text className="font-bold block text-center">
        {formatText(file.filename)}
      </Text>
    </div>,
  );
};

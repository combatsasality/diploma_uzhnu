import { FC, useEffect } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { Text } from "components";
import { Flex } from "antd";
import { FileImageOutlined } from "@ant-design/icons/lib";
import { useProject } from "contexts";

export const FileViewer: FC = () => {
  const { project, refresh } = useProject();

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: async (item: { files: File[] }) => {
        try {
          await window.projectFile.create({
            projectId: project!.id,
            absolutePath: window.api.getPathForFile(item.files[0]),
            filename: item.files[0].name,
            mimeType: item.files[0].type,
            size: item.files[0].size,
          });
          await refresh();
        } catch (error) {
          console.warn("Error adding file to project:", error);
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isOver() ? 0.5 : 1,
      }),
    }),
    [project?.id, refresh],
  );

  useEffect(() => {
    console.log(project);
  }, [project]);

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
      {project &&
        project.files.map((file) => (
          <div key={file.id} className="p-2 border-b border-gray-300">
            <Text>{file.filename}</Text>
            <Text className="text-sm text-gray-600">
              {file.mimeType} - {file.size} bytes
            </Text>
          </div>
        ))}
    </div>,
  );
};

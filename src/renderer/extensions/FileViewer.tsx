import { FC, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { Flex } from "antd";
import { FileImageOutlined } from "@ant-design/icons";

import { FileCard, Text } from "components";
import { useProject } from "contexts";
import { FileWithUrls } from "types";

export const FileViewer: FC = () => {
  const { project, refresh } = useProject();
  const [filesWithUrls, setFilesWithUrls] = useState<FileWithUrls[]>([]);

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: async (item: { files: File[] }) => {
        try {
          for (const file of item.files) {
            const absPath = window.api.getAbsolutePath(file);
            const isSupported = await window.media.supports(absPath);

            if (!isSupported) {
              console.warn(`Unsupported file type: ${file.name}`);
              continue;
            }

            await window.projectFile.create({
              projectId: project!.id,
              absolutePath: absPath,
              filename: file.name,
              mimeType: file.type,
              size: file.size,
            });
          }
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
    const loadUrls = async () => {
      if (!project?.files) {
        setFilesWithUrls([]);
        return;
      }

      const files = await Promise.all(
        project.files.map(async (file) => {
          const mediaId = await window.media.register(file.absolutePath);
          const mediaUrl = await window.media.getUrl(mediaId);

          const isVisual =
            file.mimeType.startsWith("image/") ||
            file.mimeType.startsWith("video/");

          const thumbnailUrl = isVisual
            ? await window.thumbnail.getUrl(mediaId, {
                width: 480,
                height: 270,
              })
            : undefined;

          return {
            ...file,
            mediaUrl,
            thumbnailUrl,
          };
        }),
      );

      setFilesWithUrls(files);
    };

    loadUrls();
  }, [project?.files]);

  return drop(
    <div className="w-full h-full p-4 overflow-auto" style={{ opacity }}>
      {filesWithUrls.length === 0 && (
        <Flex
          justify="center"
          align="center"
          vertical
          className="w-full h-full"
          gap={8}
        >
          <FileImageOutlined className="text-6xl" />
          <Text className="text-2xl!" tx="fileViewer.noFiles" />
        </Flex>
      )}

      <div className="flex flex-wrap gap-4">
        {filesWithUrls.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>,
  );
};

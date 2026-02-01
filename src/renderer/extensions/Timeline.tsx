import { Splitter } from "antd";
import { Text } from "components";
import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { FileWithUrls, TypeDND } from "types";

const Panel = Splitter.Panel;

const TRACK_COLORS = [
  "bg-rose-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-lime-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-violet-400",
  "bg-purple-400",
  "bg-fuchsia-400",
  "bg-pink-400",
];

const getTrackColor = (index: number) =>
  TRACK_COLORS[index % TRACK_COLORS.length];

export const Timeline: FC = () => {
  const [files, setFiles] = useState<FileWithUrls[]>([]);
  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: TypeDND.FILE,
      drop: (item: FileWithUrls) => {
        if (!files.find((file) => file.id === item.id)) {
          setFiles((prevFiles) => [...prevFiles, item]);
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isOver() ? 0.5 : 1,
      }),
    }),
    [files],
  );

  const heightColumn = 25;

  return drop(
    <div className="h-full w-full overflow-y-auto" style={{ opacity }}>
      <Splitter>
        <Panel defaultSize="10%" min="10%" max="30%">
          <div className="h-full overflow-hidden">
            {files.map((file) => (
              <div
                key={file.id}
                className="border-b overflow-hidden h-5.5"
                style={{ borderColor: "var(--ant-color-border)" }}
              >
                <Text
                  className="self-center block truncate"
                  title={file.filename}
                >
                  {file.filename}
                </Text>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <div className="h-full">
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`${getTrackColor(index)} h-5.5 w-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
              />
            ))}
          </div>
        </Panel>
      </Splitter>
    </div>,
  );
};

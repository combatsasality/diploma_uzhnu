import { FC } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { Text } from "components";

export const FileViewer: FC = () => {
  const [{ opacity }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop: (item) => console.log(item),
    collect: (monitor) => ({
      opacity: monitor.isOver() ? 0.5 : 1,
    }),
  }));

  return drop(
    <div className="w-full h-full" style={{ opacity }}>
      <Text>Test</Text>
    </div>,
  );
};

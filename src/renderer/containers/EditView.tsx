import { useEffect } from "react";
import { Splitter } from "antd";

import { Text } from "components";
import { FileViewer, Timeline } from "extensions";
import { useProject } from "contexts";

const Panel = Splitter.Panel;

export const EditView = () => {
  const { setProject } = useProject();

  useEffect(() => {
    window.project.getOrCreate({ name: "My Project" }).then((project) => {
      setProject(project);
    });
  }, []);

  return (
    <Splitter orientation="vertical">
      <Panel defaultSize="60%" min="40%" max="70%">
        <Splitter>
          <Panel defaultSize="30%" min="21%">
            <FileViewer />
          </Panel>

          <Panel min="30%">
            <Text>Edit View - Panel 2</Text>
          </Panel>
        </Splitter>
      </Panel>

      <Panel>
        <Timeline />
      </Panel>
    </Splitter>
  );
};

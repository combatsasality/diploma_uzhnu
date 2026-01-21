import { useEffect } from "react";
import { Splitter } from "antd";
import { Text } from "components";
import { FileViewer } from "extensions";
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
          <Panel defaultSize="30%" min="20%">
            <FileViewer />
          </Panel>

          <Panel min="30%">
            <Text>Edit View - Panel 2</Text>
          </Panel>
        </Splitter>
      </Panel>

      <Panel>
        <Text>Edit View - Down side Panel</Text>
      </Panel>
    </Splitter>
  );
};

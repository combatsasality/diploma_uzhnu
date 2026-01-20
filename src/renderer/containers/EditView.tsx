import { Splitter } from "antd";
import { Text } from "components";
import { FileViewer } from "extensions";

const Panel = Splitter.Panel;

export const EditView = () => {
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

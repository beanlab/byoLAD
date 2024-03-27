import React from "react";

import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";

interface StackProps {
  children: React.ReactNode | React.ReactNode[];
}

const Stack: React.FC<StackProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <div>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <VSCodeDivider role="separator" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stack;

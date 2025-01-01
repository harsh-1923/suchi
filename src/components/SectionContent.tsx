import React from "react";
import { SectionContentProps } from "./types";

const SectionContent: React.FC<SectionContentProps> = ({
  children,
  style = {},
  className = "",
}) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default SectionContent;

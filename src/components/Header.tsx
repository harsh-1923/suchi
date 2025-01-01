import React from "react";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({
  children,
  className = "",
  style = {},
}) => {
  return (
    <div data-suchi-header className={className} style={style}>
      {children}
    </div>
  );
};

export default Header;

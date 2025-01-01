import React from "react";
import { IndexProps } from "./types";
import { SuchiContext } from "./context";
import IndexDesktop from "./IndexDesktop";
import IndexMobile from "./IndexMobile";

const Index: React.FC<IndexProps> = ({ hotKey, desktop, mobile }) => {
  const { sections, isMobile } = React.useContext(SuchiContext);
  const hasSections = sections && sections.length > 0;

  return (
    <>
      {hasSections && (
        <>
          {desktop === undefined && mobile === undefined && (
            <>
              {!isMobile && <IndexDesktop hotKey={hotKey} />}
              {isMobile && <IndexMobile />}
            </>
          )}

          {desktop && !isMobile && <IndexDesktop hotKey={hotKey} />}
          {mobile && isMobile && <IndexMobile />}
        </>
      )}
    </>
  );
};

export default Index;

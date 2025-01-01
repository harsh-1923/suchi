import React from "react";
import { SectionHeaderProps } from "./types";
import { SectionContext, SuchiContext } from "./context";
import { normalise } from "./utils";

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  children,
  className = "",
  style = {},
}) => {
  const { header, setHeader } = React.useContext(SectionContext);
  const { activeSection } = React.useContext(SuchiContext);
  const displayTitle = title?.trim() || children?.trim() || "";
  const normalizedTitle = normalise(displayTitle);
  const { setSections } = React.useContext(SuchiContext);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (sectionRef.current && header) {
      const sectionId = normalise(header);
      setSections((prevSections) => {
        if (!prevSections.find((section) => section.id === sectionId)) {
          return [
            ...prevSections,
            {
              id: sectionId,
              ref: sectionRef as React.RefObject<HTMLElement>,
              title: header,
            },
          ];
        }
        return prevSections;
      });
    }
  }, [header, setSections]);

  React.useEffect(() => {
    setHeader(displayTitle);
  }, [children, displayTitle, setHeader]);

  return (
    <h2
      className={className}
      style={style}
      id={normalizedTitle}
      ref={sectionRef}
      data-suchi-section-header={
        activeSection === normalizedTitle ? "active" : "inactive"
      }
    >
      {children}
    </h2>
  );
};

export default SectionHeader;

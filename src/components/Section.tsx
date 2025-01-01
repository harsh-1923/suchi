import React from "react";
import { SectionProps } from "./types";
import { normalise } from "./utils";
import { SectionContext } from "./context";

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const [header, setHeader] = React.useState<string>("");
  // const { setSections } = React.useContext(SuchiContext);
  // const sectionRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   if (sectionRef.current && header) {
  //     const sectionId = normalise(header);
  //     setSections((prevSections) => {
  //       if (!prevSections.find((section) => section.id === sectionId)) {
  //         return [
  //           ...prevSections,
  //           {
  //             id: sectionId,
  //             ref: sectionRef as React.RefObject<HTMLElement>,
  //             title: header,
  //           },
  //         ];
  //       }
  //       return prevSections;
  //     });
  //   }
  // }, [sectionRef.current, header]);

  return (
    <SectionContext.Provider value={{ header, setHeader }}>
      <section
        // ref={sectionRef}
        style={style}
        className={className}
        id={normalise(header)}
      >
        {children}
      </section>
    </SectionContext.Provider>
  );
};

export default Section;

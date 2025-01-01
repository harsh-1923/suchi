import React from "react";
import { ReferenceProps } from "./types";
import { SuchiContext } from "./context";

const Reference: React.FC<ReferenceProps> = ({
  children,
  className = "",
  style = {},
  link,
  title,
  target = "_self",
}) => {
  const { references, setReferences, referenceListRef } =
    React.useContext(SuchiContext);
  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!children) return;

    const text = children
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();

    if (!text) return;

    const formattedText = `ref-${text}`;

    if (!isInitialized.current) {
      const referenceExists = references.some(
        (ref) => ref.link === link && ref.title === title
      );
      if (!referenceExists) {
        setReferences((prevReferences) => [
          ...prevReferences,
          {
            id: `${formattedText}`,
            title: title,
            link: link,
            index: prevReferences.length,
            target,
          },
        ]);
      }
      isInitialized.current = true;
    }
  }, [children, title, link, references, setReferences, target]);

  return (
    <span data-suchi-reference className={className} style={style}>
      <a href={link} target={target} data-suchi-reference-link>
        {children}
      </a>{" "}
      <button
        data-suchi-reference-marker
        onClick={() => {
          if (referenceListRef?.current) {
            referenceListRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
      >
        {references.length}
      </button>
    </span>
  );
};

export default Reference;

import React from "react";
import { SuchiContext } from "./context";
import { ReferenceListProps } from "./types";

const ReferenceList = ({ className, style }: ReferenceListProps) => {
  const { references, referenceListRef } = React.useContext(SuchiContext);

  if (references.length === 0) return;

  return (
    <div
      ref={referenceListRef}
      className={className}
      style={style}
      data-suchi-reference-list
    >
      {references && references.length > 0 && (
        <ol data-suchi-references aria-label="References list">
          {references.map((ref) => (
            <li key={ref.id} id={ref.id} data-suchi-reference>
              <a href={ref.link}>
                {" "}
                {ref.title} {ref.title && ":"} {ref.link}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
export default ReferenceList;

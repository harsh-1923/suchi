import React from "react";
import { SectionContextProps, SuchiContextProps } from "./types";
import { defaultScrollBehaviorControls } from "./utils";

const SectionContext = React.createContext<SectionContextProps>({
  header: "",
  setHeader: () => {},
});

const SuchiContext = React.createContext<SuchiContextProps>({
  sections: [],
  setSections: () => {},
  scrolling: false,
  setScrolling: () => {},
  activeSection: "",
  setActiveSection: () => {},
  isMobile: false,
  references: [],
  setReferences: () => {},
  referenceListRef: null,
  scrollBehaviorControls: defaultScrollBehaviorControls,
});

const useSuchi = () => {
  const { sections, activeSection, scrolling, referenceListRef, references } =
    React.useContext(SuchiContext);
  return { sections, activeSection, scrolling, referenceListRef, references };
};

export { SuchiContext, SectionContext, useSuchi };

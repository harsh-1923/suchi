"use client";
import React from "react";
import {
  defaultObserverControls,
  defaultScrollBehaviorControls,
} from "./components/utils";
import {
  ReferenceInterface,
  RootProps,
  SectionInterface,
} from "./components/types";
import { SuchiContext, useSuchi } from "./components/context";
import Section from "./components/Section";
import SectionHeader from "./components/SectionHeader";
import SectionContent from "./components/SectionContent";
import Index from "./components/Index";
import Reference from "./components/Reference";
import ReferenceList from "./components/ReferenceList";
import Header from "./components/Header";
import "./styles.css";

const Root: React.FC<RootProps> = ({
  children,
  className = "#ff4f18",
  style = {},
  accentColor = "",
  toggleWidth = 768,
  boundingRef,
  observerControls = defaultObserverControls,
  scrollBehaviorControls = defaultScrollBehaviorControls,
}) => {
  const [sections, setSections] = React.useState<SectionInterface[]>([]);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const [references, setReferences] = React.useState<ReferenceInterface[]>([]);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < toggleWidth : false
  );
  const rootRef = React.useRef<HTMLDivElement>(null);
  const referenceListRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < toggleWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [toggleWidth]);

  // Set the accentColor
  React.useEffect(() => {
    if (accentColor !== "") {
      rootRef.current?.style.setProperty("--suchi-accentColor", accentColor);
    }
  }, [accentColor]);

  /**
   * IntersectionObserver
   */

  const observerOptions = React.useMemo(
    () => observerControls,
    [observerControls]
  );

  const observerCallback = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (isScrolling) return;

      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      if (intersectingEntries.length === 0) return;
      intersectingEntries.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );

      setActiveSection(intersectingEntries[0].target.id);
    },
    [isScrolling]
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, [sections, isScrolling, observerCallback, observerOptions]);

  return (
    <SuchiContext.Provider
      value={{
        sections,
        setSections,
        activeSection,
        setActiveSection,
        isMobile,
        scrolling: isScrolling,
        setScrolling: setIsScrolling,
        boundingRef,
        references,
        setReferences,
        referenceListRef,
        scrollBehaviorControls,
      }}
    >
      <article
        data-suchi-root
        ref={rootRef}
        className={className}
        style={style}
      >
        {children}
      </article>
    </SuchiContext.Provider>
  );
};

export { useSuchi };

const Suchi = {
  Root,
  Header,
  Section,
  SectionHeader,
  SectionContent,
  Index,
  Reference,
  ReferenceList,
};

export default Suchi;

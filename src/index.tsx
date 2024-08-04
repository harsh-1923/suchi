"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
  CSSProperties,
  useCallback,
  useMemo,
} from "react";
import "./styles.css";
import scrollIntoView from "smooth-scroll-into-view-if-needed";

// Control Variables
const SCROLL_DURATION = 500;
const INTERSECTION_THRESHOLD = 0.4;

// Interfaces
interface ReadTimeProps {
  className?: string;
  style?: CSSProperties;
}

interface Section {
  id: string;
  ref: React.RefObject<HTMLElement>;
  title: string;
}

interface Reference {
  id: string;
  title?: string;
  link: string;
}

interface SuchiContextProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  references: Reference[];
  setReferences: React.Dispatch<React.SetStateAction<Reference[]>>;
  accentColor: string;
  scrolling: boolean;
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RootProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor: string;
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface SectionContextProps {
  header: string;
  setHeader: React.Dispatch<React.SetStateAction<string>>;
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface SectionHeaderProps {
  children: string;
  className?: string;
  style?: CSSProperties;
}

interface ReferenceProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  link: string;
  title: string;
}

interface ContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Contexts
const SuchiContext = createContext<SuchiContextProps>({
  sections: [],
  setSections: () => {},
  activeSection: "",
  setActiveSection: () => {},
  references: [],
  setReferences: () => {},
  accentColor: "",
  scrolling: false,
  setScrolling: () => {},
});

const SectionContext = createContext<SectionContextProps>({
  header: "",
  setHeader: () => {},
});

// Components
const ReadTime: React.FC<ReadTimeProps> = ({ className = "", style = {} }) => {
  const { sections } = useContext(SuchiContext);
  const [readTime, setReadTime] = useState<number>(0);

  useEffect(() => {
    const content = sections
      .map((section) => section.ref.current?.textContent || "")
      .join(" ");
    const words = content.split(/\s+/).length;
    const time = Math.ceil(words / 200);
    setReadTime(time);
  }, [sections]);

  return (
    <span className={className} style={style}>
      {readTime} min{`${readTime > 1 ? "s" : ""}`}
    </span>
  );
};

const Root: React.FC<RootProps> = ({
  children,
  className = "",
  style = {},
  accentColor,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [references, setReferences] = useState<Reference[]>([]);
  const [scrolling, setScrolling] = useState<boolean>(false);

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "0px",
      threshold: INTERSECTION_THRESHOLD,
    }),
    []
  );

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (scrolling) return;

      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      if (intersectingEntries.length === 0) return;

      intersectingEntries.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );

      setActiveSection(intersectingEntries[0].target.id);
    },
    [scrolling]
  );

  useEffect(() => {
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
  }, [sections, scrolling, observerCallback, observerOptions]);

  return (
    <SuchiContext.Provider
      value={{
        sections,
        setSections,
        activeSection,
        setActiveSection,
        references,
        setReferences,
        accentColor,
        scrolling,
        setScrolling,
      }}
    >
      <div className={className} style={style}>
        {sections && sections.length > 0 && <IndexDesktop />}
        {sections && sections.length > 0 && <IndexMobile />}
        {children}
        {references && references.length > 0 && (
          <ol data-suchi-references aria-label="References list">
            {references.map((ref) => (
              <li
                key={ref.id}
                id={ref.id}
                style={{ textDecoration: "underline", fontSize: "14px" }}
              >
                {ref.title} : {ref.link}
              </li>
            ))}
          </ol>
        )}
      </div>
    </SuchiContext.Provider>
  );
};

const IndexDesktop: React.FC = () => {
  const {
    sections,
    activeSection,
    setActiveSection,
    accentColor,
    setScrolling,
  } = useContext(SuchiContext);
  const [showIndex, setShowIndex] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowIndex(true);
    setIsFadingOut(false);
  };

  const handleMouseLeave = () => {
    setIsFadingOut(true);
    setTimeout(() => setShowIndex(false), 200);
  };

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);
      if (section?.ref.current) {
        scrollIntoView(section.ref.current, {
          behavior: "smooth",
          block: "start",
          duration: SCROLL_DURATION,
        });
        setActiveSection(section.id);
        setTimeout(() => {
          setScrolling(false);
        }, SCROLL_DURATION);
      }
    },
    [sections, setActiveSection, setScrolling]
  );

  return (
    <div data-suchi-index-desktop>
      <div data-suchi-desktop-indicators onMouseEnter={handleMouseEnter}>
        <ul aria-label="Section indicators">
          {sections.map((section) => (
            <li
              key={section.id}
              data-suchi-desktop-indicator
              style={{
                backgroundColor:
                  activeSection === section.id
                    ? accentColor
                    : "var(--indicator-color)",
                width: activeSection === section.id ? "20px" : "16px",
              }}
              aria-current={activeSection === section.id ? "true" : "false"}
            />
          ))}
        </ul>
      </div>

      {showIndex && (
        <div
          onMouseLeave={handleMouseLeave}
          data-suchi-desktop-tray
          className={`${isFadingOut ? "fadeout" : "fadein"}`}
        >
          <ScrollArea.Root data-suchi-scrollarea>
            <ScrollArea.Viewport data-suchi-viewport>
              <ul data-suchi-desktop-items aria-label="Section links">
                {sections.map((section) => (
                  <li key={section.id} data-suchi-dektop-item>
                    <a
                      onClick={(e) => handleLinkClick(e, section.id)}
                      style={{
                        color: activeSection === section.id ? accentColor : "",
                      }}
                      aria-current={
                        activeSection === section.id ? "true" : "false"
                      }
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar data-suchi-scrollbar orientation="vertical">
              <ScrollArea.Thumb data-suchi-scrollthumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar data-suchi-scrollbar orientation="horizontal">
              <ScrollArea.Thumb data-suchi-scrollthumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner data-suchi-scrollcorner />
          </ScrollArea.Root>
        </div>
      )}
    </div>
  );
};

const IndexMobile: React.FC = () => {
  const indexTray = useRef<HTMLDivElement>(null);
  const {
    sections,
    activeSection,
    setActiveSection,
    accentColor,
    scrolling,
    setScrolling,
  } = useContext(SuchiContext);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);
      if (section?.ref.current) {
        scrollIntoView(section.ref.current, {
          behavior: "smooth",
          block: "center",
          duration: SCROLL_DURATION,
        });
        setTimeout(() => {
          setActiveSection(section.id);
          setScrolling(false);
        }, SCROLL_DURATION);
      }
    },
    [sections, setActiveSection]
  );

  //handle the interference with the app switcher in IOS Chrome
  useEffect(() => {
    if (scrolling) return;
    let lastScrollPosition = 0;

    const handleScroll = () => {
      if (indexTray.current == null) return;
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      if (currentScrollPosition > lastScrollPosition) {
        indexTray.current.style.paddingBottom = "var(--elevated-padding)";
      } else if (currentScrollPosition < lastScrollPosition) {
        indexTray.current.style.paddingBottom = "var(--normal-padding)";
      }

      lastScrollPosition = currentScrollPosition;
    };

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSChrome = navigator.userAgent.includes("CriOS");
    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (
      window.innerWidth < 768 &&
      isMobileDevice &&
      !isAndroid &&
      (!isSafari || isIOSChrome)
    ) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolling]);

  return (
    <div ref={indexTray} data-suchi-index>
      <div data-suchi-overlay aria-hidden="true"></div>
      <ScrollArea.Root data-suchi-scrollarea>
        <ScrollArea.Viewport>
          <div data-suchi-items aria-label="Section links">
            {sections.map((section) => (
              <a
                onClick={(e) => handleLinkClick(e, section.id)}
                key={section.id}
                style={{
                  color: activeSection === section.id ? accentColor : "",
                }}
                data-suchi-item="true"
                aria-current={activeSection === section.id ? "true" : "false"}
              >
                {section.title}
              </a>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar data-suchi-scrollbar orientation="vertical">
          <ScrollArea.Thumb data-suchi-scrollthumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar data-suchi-scrollbar orientation="horizontal">
          <ScrollArea.Thumb data-suchi-scrollthumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner data-suchi-scrollcorner />
      </ScrollArea.Root>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  children,
  className = "",
  style = {},
}) => {
  return (
    <h2 className={className} style={style} aria-label="Section header">
      {children}
    </h2>
  );
};

const Section: React.FC<SectionProps> = ({
  children,
  style = {},
  className = "",
}) => {
  const [header, setHeader] = useState<string>("");
  const { setSections } = useContext(SuchiContext);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current && header) {
      const sectionId = `${header
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim()}`;

      setSections((prevSections) => {
        if (!prevSections.find((section) => section.id === sectionId)) {
          return [
            ...prevSections,
            { id: sectionId, ref: sectionRef, title: header },
          ];
        }
        return prevSections;
      });
    }
  }, [sectionRef.current, header, setSections]);

  return (
    <SectionContext.Provider value={{ header, setHeader }}>
      <section
        ref={sectionRef}
        style={style}
        className={className}
        id={header
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .trim()}
        aria-labelledby={`${header
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .trim()}-label`}
      >
        {children}
      </section>
    </SectionContext.Provider>
  );
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const { setHeader } = useContext(SectionContext);

  useEffect(() => {
    setHeader(children.trim());
  }, [children, setHeader]);

  return (
    <h2
      className={className}
      style={style}
      id={`${children
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim()}-label`}
      aria-label="Section header"
    >
      {children}
    </h2>
  );
};

const Reference: React.FC<ReferenceProps> = ({
  children,
  className = "",
  style = {},
  link,
  title,
}) => {
  const { references, setReferences } = useContext(SuchiContext);
  const [refText, setRefText] = useState<string>();
  const isInitialized = useRef(false);

  useEffect(() => {
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
      setRefText(formattedText);
      const referenceExists = references.some(
        (ref) => ref.link === link && ref.title === title
      );
      if (!referenceExists) {
        setReferences((prevReferences) => [
          ...prevReferences,
          { id: `${formattedText}`, title: title, link: link },
        ]);
      }
      isInitialized.current = true;
    }
  }, [children, title, link, references, setReferences]);

  return (
    <>
      <a className={className} style={style} href={`#${refText}`}>
        {children}
      </a>
      <sup>{references.length}</sup>
    </>
  );
};

const Content: React.FC<ContentProps> = ({
  children,
  style = {},
  className = "",
}) => {
  return (
    <div className={className} style={style} role="region">
      {children}
    </div>
  );
};

const Suchi = {
  Root,
  Section,
  SectionHeader,
  Reference,
  Content,
  Header,
  ReadTime,
};

export default Suchi;

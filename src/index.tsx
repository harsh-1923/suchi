"use client";

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

// Control Variables
const SCROLL_DURATION = 700;
const INTERSECTION_THRESHOLD = 0.4;

// Interfaces
interface Section {
  id: string;
  ref: React.RefObject<HTMLElement>;
  title: string;
}

interface ReferenceProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  link: string;
  title: string;
}

interface Reference {
  id: string;
  title?: string;
  link: string;
  index?: any;
}

interface IndexDesktopProps {
  hotKey?: string;
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
  accentColor?: string;
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
  title?: string;
  children?: string;
  className?: string;
  style?: CSSProperties;
}

interface ContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface ReferenceListProps {
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
const Root: React.FC<RootProps> = ({
  children,
  className = "",
  style = {},
  accentColor = "",
}): React.ReactElement => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [references, setReferences] = useState<Reference[]>([]);
  const [scrolling, setScrolling] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accentColor !== "") {
      rootRef.current?.style.setProperty("--suchi-accentColor", accentColor);
    }
  }, [accentColor]);

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
      <div ref={rootRef} data-suchi-root className={className} style={style}>
        {children}
      </div>
    </SuchiContext.Provider>
  );
};

const ReferenceList = ({ className, style }: ReferenceListProps) => {
  const { references } = useContext(SuchiContext);
  return (
    <div className={className} style={style}>
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
  );
};

const Index = ({
  desktop,
  mobile,
  hotKey,
}: {
  desktop?: boolean;
  mobile?: boolean;
  hotKey?: string;
}) => {
  const { sections } = useContext(SuchiContext);

  const hasSections = sections && sections.length > 0;

  return (
    <>
      {hasSections && (
        <>
          {desktop === undefined && mobile === undefined && (
            <>
              <IndexDesktop hotKey={hotKey} />
              <IndexMobile />
            </>
          )}

          {desktop && <IndexDesktop hotKey={hotKey} />}
          {mobile && <IndexMobile />}
        </>
      )}
    </>
  );
};

const IndexDesktop: React.FC<IndexDesktopProps> = ({ hotKey }) => {
  const {
    sections,
    activeSection,
    setActiveSection,
    accentColor,
    setScrolling,
  } = useContext(SuchiContext);
  const [showIndex, setShowIndex] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openedViaKeyboard = useRef<boolean>(false);

  const handleMouseEnter = () => {
    openedViaKeyboard.current = false;
    setShowIndex(true);
    setIsFadingOut(false);
  };

  const handleMouseLeave = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowIndex(false);
      if (activeButtonRef.current) {
        activeButtonRef.current.blur();
      }
    }, 200);
  };

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);
      if (section?.ref.current) {
        setActiveSection(section.id);
        section?.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setTimeout(() => {
          setScrolling(false);
        }, SCROLL_DURATION);
      }
    },
    [sections, setActiveSection, setScrolling]
  );

  useEffect(() => {
    const parseHotkey = (hotkey: string) => {
      const keys = hotkey
        .toLowerCase()
        .split("+")
        .map((k) => k.trim());
      return {
        ctrlKey: keys.includes("ctrl"),
        metaKey: keys.includes("cmd"),
        altKey: keys.includes("alt"),
        shiftKey: keys.includes("shift"),
        key:
          keys.find((k) => !["ctrl", "cmd", "alt", "shift"].includes(k)) || "",
      };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const defaultHotkey = {
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        key: "/",
      };
      const hotkey = hotKey ? parseHotkey(hotKey) : defaultHotkey;

      if (
        (hotkey.ctrlKey === e.ctrlKey || hotkey.metaKey === e.metaKey) &&
        hotkey.key === e.key.toLowerCase()
      ) {
        e.preventDefault();
        openedViaKeyboard.current = true;
        setShowIndex((prevShowIndex) => !prevShowIndex);
      }

      if (e.key === "Escape") {
        setShowIndex(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotKey]);

  // Focus the active button when showIndex is toggled via keyboard
  useEffect(() => {
    if (showIndex && activeButtonRef.current && openedViaKeyboard.current) {
      activeButtonRef.current.focus({ preventScroll: true });
    } else if (!showIndex && activeButtonRef.current) {
      activeButtonRef.current.blur();
    }
  }, [showIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (!showIndex || !containerRef.current) return;

      const buttons = containerRef.current.querySelectorAll("button");
      const currentIndex = Array.from(buttons).findIndex(
        (btn) => btn === document.activeElement
      );

      if (e.key === "ArrowDown" && currentIndex < buttons.length - 1) {
        (buttons[currentIndex + 1] as HTMLButtonElement).focus();
        e.preventDefault();
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        (buttons[currentIndex - 1] as HTMLButtonElement).focus();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [showIndex]);

  return (
    <div data-suchi-desktop>
      <ul data-suchi-indicators onMouseEnter={handleMouseEnter}>
        {sections.map((section) => (
          <li
            key={section.id}
            data-suchi-indicator={`${
              activeSection === section.id ? "active" : "inactive"
            }`}
          ></li>
        ))}
      </ul>

      {showIndex && (
        <div
          ref={containerRef}
          onMouseLeave={handleMouseLeave}
          data-suchi-desktop-items
          className={`${isFadingOut ? "fadeOut" : "fadein"} custom-scrollbar`}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              ref={section.id === activeSection ? activeButtonRef : null}
              onClick={(e) => handleLinkClick(e, section.id)}
              data-suchi-desktop-item={`${
                section.id === activeSection ? "active" : "inactive"
              }`}
            >
              {section.title}
            </button>
          ))}
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

  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    if (scrolling) {
      return;
    }

    if (activeSection) {
      buttonRefs.current[activeSection]?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }
  }, [activeSection]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);
      if (section?.ref.current) {
        setActiveSection(section.id);
        section?.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setTimeout(() => {
          setScrolling(false);
        }, SCROLL_DURATION);
      }
    },
    [sections, setActiveSection, setScrolling]
  );

  //handle the interference with the app switcher in IOS Chrome
  useEffect(() => {
    if (scrolling) return;

    let lastScrollPosition = 0;

    const handleScroll = () => {
      if (indexTray.current == null) return;
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      if (currentScrollPosition === 0) {
        indexTray.current.style.paddingBottom =
          "var(--suchi-mobile-normal-padding)";
      } else if (currentScrollPosition > lastScrollPosition) {
        indexTray.current.style.paddingBottom =
          "var(--suchi-mobile-elevated-padding)";
      } else if (currentScrollPosition < lastScrollPosition) {
        indexTray.current.style.paddingBottom =
          "var(--suchi-mobile-normal-padding)";
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
    <div data-suchi-mobile>
      <div data-suchi-mobile-overlay></div>
      <div ref={indexTray} data-suchi-mobile-scrollarea>
        <div data-suchi-mobile-items>
          {sections.map((section) => (
            <button
              ref={(el) => {
                buttonRefs.current[section.id] = el;
              }}
              onClick={(e) => handleLinkClick(e, section.id)}
              key={section.id}
              style={{
                color:
                  activeSection === section.id
                    ? accentColor
                    : "var(--suchi-inactive-item)",
              }}
              data-suchi-mobile-item={`${
                section.id === activeSection ? "active" : "inactive"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  children,
  className = "",
  style = {},
}) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
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
  title,
  className = "",
  style = {},
}) => {
  const { setHeader } = useContext(SectionContext);
  const { activeSection } = useContext(SuchiContext);

  const displayTitle = title?.trim() || children?.trim() || "";

  const normalizedTitle = displayTitle
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();
  const isActive = activeSection === normalizedTitle;

  useEffect(() => {
    setHeader(displayTitle);
  }, [children, setHeader, displayTitle]);

  return (
    <h2
      className={className}
      style={style}
      id={`${normalizedTitle}-label`}
      aria-label={children?.trim() || displayTitle.trim()}
      data-suchi-section-header={isActive ? "active" : "inactive"}
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
          {
            id: `${formattedText}`,
            title: title,
            link: link,
          },
        ]);
      }
      isInitialized.current = true;
    }
  }, [children, title, link, references, setReferences]);

  return (
    <a className={className} style={style} href={`#${refText}`}>
      {children}
    </a>
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
  Index,
  ReferenceList,
};

export default Suchi;

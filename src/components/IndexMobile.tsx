import React from "react";
import { SuchiContext } from "./context";
import { SCROLL_DURATION } from "./utils";
import { isIOSChrome } from "./browser";

const IndexMobile = () => {
  const indexTrayRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const {
    sections,
    activeSection,
    setActiveSection,
    scrolling,
    setScrolling,
    scrollBehaviorControls,
  } = React.useContext(SuchiContext);

  React.useEffect(() => {
    /**
     * If the user  is scrolling,
     * brings the current section button into view
     */
    if (scrolling) {
      return;
    }

    if (activeSection) {
      buttonRefs.current[activeSection]?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }
  }, [activeSection, scrolling]);

  const handleLinkClick = React.useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);
      if (section?.ref.current) {
        setActiveSection(section.id);
        section?.ref.current.scrollIntoView(scrollBehaviorControls);
        setTimeout(() => {
          setScrolling(false);
        }, SCROLL_DURATION);
      }
    },
    [sections, setActiveSection, setScrolling, scrollBehaviorControls]
  );

  React.useEffect(() => {
    let lastScrollPosition = 0;
    const handleScroll = () => {
      if (scrolling) return;
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const scrollDirection =
        currentScrollPosition - lastScrollPosition >= 0 ? 1 : -1;

      if (!indexTrayRef.current) return;

      if (scrollDirection === 1 && isIOSChrome()) {
        if (currentScrollPosition > 1)
          // avoid elevation due to bounce
          indexTrayRef.current.style.paddingBottom =
            "var(--suchi-mobile-elevated-padding)";
      } else {
        indexTrayRef.current.style.paddingBottom =
          "var(--suchi-mobile-padding)";
      }

      lastScrollPosition = currentScrollPosition;
    };

    if (isIOSChrome()) window.addEventListener("scroll", handleScroll);

    return () => {
      if (isIOSChrome()) window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolling]);

  return (
    <div data-suchi-mobile>
      <div ref={indexTrayRef} data-suchi-mobile-items>
        {sections.map((section) => (
          <button
            onClick={(e) => handleLinkClick(e, section.id)}
            key={section.id}
            ref={(el) => {
              buttonRefs.current[section.id] = el;
            }}
            style={{
              color:
                activeSection === section.id
                  ? "var(--suchi-accentColor)"
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
  );
};

export default IndexMobile;

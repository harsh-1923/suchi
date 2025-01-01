import React, { CSSProperties } from "react";
import { SuchiContext } from "./context";
import { SCROLL_DURATION } from "./utils";
import { IndexDesktopProps } from "./types";

const IndexDesktop: React.FC<IndexDesktopProps> = ({ hotKey }) => {
  const {
    sections,
    activeSection,
    setScrolling,
    setActiveSection,
    scrollBehaviorControls,
    boundingRef,
  } = React.useContext(SuchiContext);
  const [showIndex, setShowIndex] = React.useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = React.useState<boolean>(false);
  const openedViaKeyboard = React.useRef<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const [positionStyle, setPositionStyle] = React.useState<CSSProperties>({
    position: "fixed",
    top: "30%",
    right: "16px",
    zIndex: 99999999,
  });

  React.useEffect(() => {
    if (boundingRef?.current) {
      const boundingRect = boundingRef.current.getBoundingClientRect();
      setPositionStyle({
        position: "absolute",
        top: `${boundingRect.top + 100}px`,
        left: `${boundingRect.right - 20}px`,
        zIndex: 99999999,
      });
    }
  }, [boundingRef]);

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

  const handleLinkClick = React.useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setScrolling(true);
      const section = sections.find((sec) => sec.id === sectionId);

      if (section?.ref?.current) {
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
  React.useEffect(() => {
    if (showIndex && activeButtonRef.current && openedViaKeyboard.current) {
      activeButtonRef.current.focus({ preventScroll: true });
    } else if (!showIndex && activeButtonRef.current) {
      activeButtonRef.current.blur();
    }
  }, [showIndex]);

  // Handle keyboard navigation
  React.useEffect(() => {
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
    <div data-suchi-desktop style={positionStyle}>
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

export default IndexDesktop;

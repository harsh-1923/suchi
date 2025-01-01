import { CSSProperties, ReactNode } from "react";

export enum SuchiThemeEnum {
  "light",
  "dark",
  "system",
  "undefined",
}

/**
 * ROOT
 */

export interface RootProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
  toggleWidth?: number;
  boundingRef?: React.RefObject<HTMLDivElement>;
  observerControls?: IntersectionObserverInit;
  scrollBehaviorControls?: ScrollIntoViewOptions;
}

/**
 * SUCHI CONTEXT
 */

export interface SuchiContextProps {
  sections: SectionInterface[];
  setSections: React.Dispatch<React.SetStateAction<SectionInterface[]>>;
  scrolling: boolean;
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
  boundingRef?: React.RefObject<HTMLDivElement>;
  references: ReferenceInterface[];
  setReferences: React.Dispatch<React.SetStateAction<ReferenceInterface[]>>;
  referenceListRef: React.RefObject<HTMLDivElement | null> | null;
  scrollBehaviorControls: ScrollIntoViewOptions;
}

export interface HeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * SECTION
 */

export interface SectionContextProps {
  header: string;
  setHeader: (header: string) => void;
}

export interface SectionInterface {
  id: string;
  ref: React.RefObject<HTMLElement>;
  title: string;
}

export interface SectionProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface SectionHeaderProps {
  title?: string;
  children?: string;
  className?: string;
  style?: CSSProperties;
}

export interface SectionContentProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * SECTION HEADER
 */

export interface SectionHeaderProps {
  title?: string;
  children?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Index
 */

export interface IndexProps {
  hotKey?: string;
  desktop?: boolean;
  mobile?: boolean;
}

export interface IndexDesktopProps {
  hotKey?: string;
}

export interface ReferenceProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  link: string;
  title?: string;
  target?: string;
}

export interface ReferenceInterface {
  id: string;
  title?: string;
  link: string;
  index: number;
  target: string;
}

export interface ReferenceListProps {
  className?: string;
  style?: CSSProperties;
}

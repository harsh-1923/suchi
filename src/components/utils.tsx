const SCROLL_DURATION = 700;
const INTERSECTION_THRESHOLD = 0.4;

export const defaultObserverControls = {
  root: null,
  rootMargin: "0px",
  threshold: INTERSECTION_THRESHOLD,
};

export const defaultScrollBehaviorControls = {
  behavior: "smooth" as ScrollBehavior,
  block: "start" as ScrollLogicalPosition,
};

const normalise = (val: string) => {
  return val
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();
};

const getCurrentOrientation = () => {
  return window.innerWidth < 786;
};

export {
  normalise,
  getCurrentOrientation,
  INTERSECTION_THRESHOLD,
  SCROLL_DURATION,
};

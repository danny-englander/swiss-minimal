/** One entry in the slide-down menu. Give it `href` for a link, or `children` for an accordion. */
export interface MenuItem {
  label: string;
  href?: string;
  /** Marks the page you are on (underlined in the accent). */
  current?: boolean;
  /** Start this accordion open. */
  open?: boolean;
  /** Submenu items. Can nest. */
  children?: MenuItem[];
}

/** One numbered tab in the slide-down panel. Its content goes in the slot named after `id`. */
export interface PanelTab {
  /** Also the deep link: #about opens the panel on this tab. No element on the page may use it as its id. */
  id: string;
  label: string;
}

/** The "new" dot on the menu button and on one tab (kit/new-dot.js). */
export interface NewDot {
  /** The newest entry's date, YYYY-MM-DD. */
  latest: string;
  /** The id of the tab that lists what is new. Opening it clears the dot. */
  tab: string;
  /** localStorage key for the date last seen, e.g. "mysite:features-seen". */
  key: string;
  /** localStorage keys whose presence marks a returning visitor. Default ["theme"]. */
  returning?: string[];
  /** Added to the menu button's name while the dot shows. Default "new features". */
  note?: string;
}

/** One post in a blog's index (PostList), newest first. */
export interface Post {
  title: string;
  href: string;
  /** YYYY-MM-DD, the day it was published. */
  date: string;
  /** One or two plain sentences. */
  summary?: string;
  /** A quiet line under the summary, e.g. "Type · 4 min read". */
  meta?: string;
}

/** A link to a neighboring post (PostNav). */
export interface PostLink {
  title: string;
  href: string;
}

/** One entry in a dated list such as a Features tab, newest first. */
export interface Feature {
  /** YYYY-MM-DD, the day it went live. */
  date: string;
  title: string;
  /** One or two plain sentences. */
  body: string;
  /**
   * Specific points for release notes, one sentence each: what it does, where to see it, what
   * a site needs to do. The Features list on the page shows only the body.
   */
  details?: string[];
}

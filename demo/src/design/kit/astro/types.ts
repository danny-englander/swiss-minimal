/** One entry in the slide-down menu. Give it `href` for a link, or `children` for an accordion. */
export interface MenuItem {
  label: string;
  href?: string;
  /** Marks the page you are on (underlined in red). */
  current?: boolean;
  /** Start this accordion open. */
  open?: boolean;
  /** Submenu items. Can nest. */
  children?: MenuItem[];
}

export interface HeaderNavItem {
  href: string;
  label: string;
}

export interface HeaderContent {
  ariaLabel: string;
  navItems: HeaderNavItem[];
  ctaLabel: string;
}

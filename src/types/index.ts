// Global type definitions

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[]
}

export interface DocsConfig {
  mainNav: NavItem[]
  sidebarNav: SidebarNavItem[]
}
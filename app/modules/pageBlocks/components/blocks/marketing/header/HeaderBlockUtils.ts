export type HeaderBlockDto = {
  style: HeaderBlockStyle;
  links: NavbarItemDto[];
  withLogo: boolean;
  withSignInAndSignUp: boolean;
  withDarkModeToggle: boolean;
  withLanguageSelector: boolean;
  withThemeSelector?: boolean;
};

export const HeaderBlockStyles = [{ value: "simple", name: "Simple" }] as const;
export type HeaderBlockStyle = (typeof HeaderBlockStyles)[number]["value"];

export interface NavbarItemDto {
  id?: string;
  title: string;
  path?: string;
  description?: string;
  className?: string;
  items?: NavbarItemDto[];
  target?: "_blank";
  hint?: string;
}

export const defaultHeaderBlock: HeaderBlockDto = {
  style: "simple",
  withLogo: true,
  withSignInAndSignUp: true,
  withDarkModeToggle: false,
  withLanguageSelector: false,
  withThemeSelector: false,
  links: [
    { path: "/", title: "Product" },
    { path: "/pricing", title: "Pricing" },
    {
      title: "About",
      items: [
        { path: "/contact", title: "front.navbar.contact" },
        { path: "/newsletter", title: "Newsletter" },
      ],
    },
  ],
};

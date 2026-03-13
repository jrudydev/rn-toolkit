export interface FooterLink {
  label: string;
  url: string;
}

export interface AppFooterProps {
  /**
   * Show Patreon/SparkLabs link
   * @default true
   */
  showPatreonLink?: boolean;

  /**
   * Show GitHub link
   * @default true
   */
  showGitHub?: boolean;

  /**
   * Show copyright
   * @default true
   */
  showCopyright?: boolean;

  /**
   * App version to display
   */
  version?: string;

  /**
   * Custom links to display
   */
  customLinks?: FooterLink[];

  /**
   * Test ID for testing
   */
  testID?: string;
}

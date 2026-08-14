import type { PortfolioContent } from "../content";

export function Footer({ content }: { content: PortfolioContent }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} {content.brand}</p>
        <p>{content.footer}</p>
      </div>
    </footer>
  );
}

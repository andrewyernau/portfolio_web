export function PageIntro({ eyebrow, title, introduction }: { eyebrow: string; title: string; introduction: string }) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{introduction}</p>
    </header>
  );
}

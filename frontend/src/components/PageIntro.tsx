export function PageIntro({ title, introduction }: { title: string; introduction: string }) {
  return (
    <header className="page-intro">
      <h1>{title}</h1>
      <p className="lede">{introduction}</p>
    </header>
  );
}

interface PageTitleProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageTitle({ eyebrow, title, description }: PageTitleProps) {
  return (
    <div className="stack-sm">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}

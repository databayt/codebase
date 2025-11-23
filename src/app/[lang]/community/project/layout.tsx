export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="wrapper">{children}</div>
    </div>
  );
}
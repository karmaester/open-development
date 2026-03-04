export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <p>OpenDevelopment &mdash; Open-source development data platform</p>
        <p>&copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <section className="grid gap-6">
      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome 👋</h2>
        <p className="text-sm text-muted-foreground">
          Theme toggle is in the header. Next step: wire up the game screen at <code>/game</code>.
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70svh] flex-col justify-center py-section">
      <p className="type-label tabular-nums text-muted-foreground">404</p>
      <h1 className="type-display mt-4 max-w-[16ch] text-foreground">Bu sayfa burada değil</h1>
      <p className="mt-6 max-w-[52ch] text-muted-foreground md:text-xl">
        Adres değişmiş ya da sayfa kaldırılmış olabilir. Projelerimize ya da ana sayfaya buradan dönebilirsiniz.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href="/projeler" prefetch={false} />}>
          Projeler
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/" prefetch={false} />}>
          Ana sayfa
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiRefreshLine } from "react-icons/ri";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hatayı logla
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell flex min-h-[70svh] flex-col justify-center py-section">
      <h1 className="type-display max-w-[16ch] text-foreground">Bir şeyler yanlış gitti</h1>
      <p className="mt-6 max-w-[52ch] text-muted-foreground md:text-xl">
        Sayfa yüklenirken beklenmedik bir hata oluştu. Yeniden denemek çoğu zaman yeterli olur.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => reset()}>
          <RiRefreshLine aria-hidden />
          Tekrar dene
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/" prefetch={false} />}>
          Ana sayfaya dön
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-10 max-w-full overflow-auto bg-surface p-4 text-left text-sm">{error.message}</pre>
      )}
    </div>
  );
}

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-sm border border-input bg-background px-3 py-3 text-[1.125rem] leading-relaxed text-foreground transition-colors duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-cypress focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cypress disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

"use client";

import { useState } from "react";
import { z } from "zod";
import { RiErrorWarningLine, RiCheckLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

type FormData = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

type ContactFormProps = {
  formTitle?: string;
  successMessage?: string;
};

// Errors are words plus an icon, never color alone (docs/DESIGN.md → Inputs).
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-center gap-1.5 text-base text-destructive">
      <RiErrorWarningLine aria-hidden className="size-5 shrink-0" />
      {message}
    </p>
  );
}

export function ContactForm({ formTitle, successMessage }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Alan hatasını temizle
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});

    // Client-side validasyon
    const result = schema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as FieldErrors);
      setStatus("idle");
      return;
    }

    // Honeypot alanını al
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        if (data.error && typeof data.error === "object") {
          setFieldErrors(data.error);
        }
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 border-t border-cypress pt-6">
        <RiCheckLine aria-hidden className="mt-0.5 size-6 shrink-0 text-cypress" />
        <p className="type-title text-foreground">{successMessage}</p>
      </div>
    );
  }

  const describedBy = (field: keyof FormData) => (fieldErrors[field] ? `${field}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {formTitle && <h2 className="type-headline text-foreground">{formTitle}</h2>}

      {/* Honeypot — spam botları için gizli alan */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={describedBy("name")}
          />
          <FieldError id="name-error" message={fieldErrors.name?.[0]} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-posta *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={describedBy("email")}
          />
          <FieldError id="email-error" message={fieldErrors.email?.[0]} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Konu</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Mesaj *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={describedBy("message")}
        />
        <FieldError id="message-error" message={fieldErrors.message?.[0]} />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-center gap-1.5 text-destructive">
          <RiErrorWarningLine aria-hidden className="size-5 shrink-0" />
          Mesaj gönderilemedi. Lütfen tekrar deneyin ya da satış ofisini arayın.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="self-start">
        {status === "loading" ? "Gönderiliyor…" : "Gönder"}
      </Button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine, RiPhoneLine } from "react-icons/ri";
import { Wordmark } from "@/components/layout/Wordmark";
import { telHref, whatsappHref } from "@/lib/project";
import { cn } from "@/lib/utils";

import { SanityImage as SanityImageType, NavItem, SocialLink } from "@/types";

const socialIconMap: Record<string, React.ElementType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
};

const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export interface HeaderProps {
  siteName?: string;
  logo?: SanityImageType;
  links?: NavItem[];
  phone?: string;
  whatsappNumber?: string;
  whatsappLabel?: string;
  socialLinks?: SocialLink[];
}

function resolveHref(item: NavItem): string {
  return item.href || "#";
}

export function Header({
  siteName,
  logo,
  links = [],
  phone,
  whatsappNumber,
  whatsappLabel,
  socialLinks = [],
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Menü açıkken arka plan scroll kilidi
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const isActive = (item: NavItem) => {
    const href = resolveHref(item);
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const socials = socialLinks.filter((social) => social.url && socialIconMap[social.platform]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <div className="page-shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            prefetch={false}
            onMouseEnter={() => router.prefetch("/")}
            onClick={closeMenu}
            aria-label={siteName ? `${siteName} ana sayfa` : "Ana sayfa"}
            className="flex items-center text-foreground outline-offset-4"
          >
            <Wordmark siteName={siteName} logo={logo} />
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <nav aria-label="Ana menü" className="flex items-center gap-7">
              {links.map((item, i) => (
                <DesktopNavItem key={i} item={item} active={isActive(item)} />
              ))}
            </nav>
            {phone && (
              <a
                href={telHref(phone)}
                className="flex items-center gap-2 font-semibold tabular-nums text-foreground underline-offset-4 transition-colors hover:text-cypress hover:underline"
              >
                <RiPhoneLine aria-hidden className="size-5 text-cypress" />
                {phone}
              </a>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            {phone && (
              <a
                href={telHref(phone)}
                aria-label={`Ara: ${phone}`}
                className="flex size-11 items-center justify-center text-cypress"
              >
                <RiPhoneLine aria-hidden className="size-6" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex size-11 items-center justify-center text-foreground"
            >
              {menuOpen ? <RiCloseLine aria-hidden className="size-6" /> : <RiMenu3Line aria-hidden className="size-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
              className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-background md:hidden"
            >
              <nav aria-label="Mobil menü" className="page-shell flex flex-col py-6">
                {links.map((item, i) => (
                  <div key={i} className="border-b border-border">
                    <Link
                      href={resolveHref(item)}
                      prefetch={false}
                      onClick={closeMenu}
                      aria-current={isActive(item) ? "page" : undefined}
                      className={cn(
                        "type-title block py-4",
                        isActive(item) ? "text-cypress" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.subLinks && item.subLinks.length > 0 && (
                      <div className="flex flex-col pb-3 pl-4">
                        {item.subLinks.map((sub, j) => (
                          <Link
                            key={j}
                            href={resolveHref(sub)}
                            prefetch={false}
                            onClick={closeMenu}
                            className={cn("py-2", isActive(sub) ? "text-cypress" : "text-muted-foreground")}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(phone || whatsappNumber || socials.length > 0) && (
                  <div className="mt-8 flex flex-col gap-4">
                    {phone && (
                      <a href={telHref(phone)} className="flex items-center gap-3 type-title tabular-nums text-foreground">
                        <RiPhoneLine aria-hidden className="size-6 text-cypress" />
                        {phone}
                      </a>
                    )}
                    {whatsappNumber && whatsappLabel && (
                      <a
                        href={whatsappHref(whatsappNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-foreground"
                      >
                        <FaWhatsapp aria-hidden className="size-6 text-cypress" />
                        {whatsappLabel}
                      </a>
                    )}
                    {socials.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {socials.map((social, i) => {
                          const Icon = socialIconMap[social.platform];
                          return (
                            <a
                              key={i}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.platform}
                              className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-cypress hover:text-cypress"
                            >
                              <Icon aria-hidden size={18} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Alt menü linklerinden biri aktifse üst menüyü de aktif boyarız
  const isSubActive = item.subLinks?.some((sub) => pathname === resolveHref(sub));
  const reallyActive = active || isSubActive;
  const linkClass = cn(
    "flex items-center gap-1 underline-offset-[6px] decoration-2 transition-colors hover:text-cypress hover:underline",
    reallyActive ? "text-cypress underline" : "text-foreground"
  );

  if (!item.subLinks || item.subLinks.length === 0) {
    return (
      <Link
        href={resolveHref(item)}
        prefetch={false}
        onMouseEnter={() => router.prefetch(resolveHref(item))}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        aria-current={active ? "page" : undefined}
        className={linkClass}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
    >
      <Link
        href={resolveHref(item)}
        prefetch={false}
        onMouseEnter={() => router.prefetch(resolveHref(item))}
        aria-expanded={isOpen}
        className={linkClass}
      >
        {item.label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: EASE_OUT_QUART }}>
          <RiArrowDownSLine aria-hidden size={16} />
        </motion.span>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
            className="absolute left-0 top-full min-w-[14rem] pt-4"
          >
            <div className="border border-border bg-popover py-2">
              {item.subLinks.map((sub, j) => {
                const subActive = pathname === resolveHref(sub);
                return (
                  <Link
                    key={j}
                    href={resolveHref(sub)}
                    prefetch={false}
                    onMouseEnter={() => router.prefetch(resolveHref(sub))}
                    target={sub.openInNewTab ? "_blank" : undefined}
                    rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                    className={cn(
                      "block px-4 py-2.5 transition-colors hover:bg-surface",
                      subActive ? "text-cypress" : "text-foreground"
                    )}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

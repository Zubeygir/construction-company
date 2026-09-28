import Link from "next/link";
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
import { Wordmark } from "@/components/layout/Wordmark";
import { telHref } from "@/lib/project";

import { SiteSettings, Navigation, NavItem } from "@/types";

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

const linkClass =
  "text-on-cypress underline-offset-4 transition-colors hover:underline focus-visible:outline-on-cypress";

function resolveHref(item: NavItem): string {
  return item.href || "#";
}

export function Footer({ settings, navigation }: { settings: SiteSettings; navigation: Navigation }) {
  const footerLinks = navigation?.footerLinks || [];
  const socialLinks = (settings?.socialLinks || []).filter((s) => s.url && socialIconMap[s.platform]);
  const contact = settings?.contactInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cypress-deep text-on-cypress">
      <div className="page-shell py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            {/* The uploaded logo is ink-colored; on cypress the set wordmark is used instead */}
            <Wordmark siteName={settings?.siteName} />
            {settings?.siteTagline && <p className="mt-6 max-w-[32ch] text-on-cypress-muted">{settings.siteTagline}</p>}
          </div>

          {(contact?.address || contact?.phone || contact?.email) && (
            <address className="not-italic md:col-span-4">
              {contact.address && <p className="whitespace-pre-line text-on-cypress-muted">{contact.address}</p>}
              <div className="mt-4 flex flex-col gap-2">
                {contact.phone && (
                  <a href={telHref(contact.phone)} className={`${linkClass} tabular-nums`}>
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    {contact.email}
                  </a>
                )}
              </div>
            </address>
          )}

          {footerLinks.length > 0 && (
            <nav aria-label="Alt menü" className="md:col-span-3">
              <ul className="flex flex-col gap-2">
                {footerLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={resolveHref(item)}
                      prefetch={false}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className={linkClass}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-on-cypress/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-cypress-muted">
            © {currentYear} {settings?.siteName}. {settings?.copyrightNotice}
          </p>
          {socialLinks.length > 0 && (
            <div className="-ml-3 flex flex-wrap sm:ml-0 sm:-mr-3">
              {socialLinks.map((social, i) => {
                const Icon = socialIconMap[social.platform];
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="flex size-11 items-center justify-center text-on-cypress-muted transition-colors hover:text-on-cypress focus-visible:outline-on-cypress"
                  >
                    <Icon aria-hidden size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

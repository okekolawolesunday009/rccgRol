'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookies Policy', href: '/cookies' },
];

const socialLinks = [
  {
    icon: <FaFacebook />,
    label: 'Facebook',
    href: 'https://facebook.com/rccglp17',
  },
  {
    icon: <FaYoutube />,
    label: 'YouTube',
    href: 'https://youtube.com/rccglp17',
  },
  {
    icon: <FaInstagram />,
    label: 'Instagram',
    href: 'https://instagram.com/rccglp17',
  },
  {
    icon: <FaTwitter />,
    label: 'Twitter',
    href: 'https://twitter.com/rccglp17',
  },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="font-semibold text-black tracking-wide uppercase text-sm">
        {title}
      </h3>

      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Logo */}
          <div className="space-y-5">
            <Link
              href="/"
              className="flex items-center gap-4"
            >
              <img
                src="/rccg.png"
                alt="RCCG LP17 HQ Logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-slate-600 leading-7">
              RCCG LP17 HQ <br />
              River Of Life Sanctuary
            </p>

            <p className="text-sm text-slate-600">
              Lagos, Nigeria
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-amber-500 hover:text-white"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <FooterColumn title="Navigation">
            <ul className="space-y-3">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-amber-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <ul className="space-y-3 text-sm text-slate-600">
              <li>Lagos, Nigeria</li>
              <li>RCCG LP17 Headquarters</li>
              <li>River Of Life Sanctuary</li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-500"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal">
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-amber-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* Bottom Section */}
        <div className="mt-14 border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} RCCG LP17 HQ – River Of
              Life Sanctuary. All Rights Reserved.
            </p>

            <p className="text-sm italic text-slate-600">
              “Jesus Christ is the same yesterday and today and
              forever.” — Hebrews 13:8
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
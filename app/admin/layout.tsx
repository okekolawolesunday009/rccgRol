import { getSession } from '@/lib/admin-auth';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If on login page, don't show the dashboard shell
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {session && (
        <nav className="bg-slate-900 border-b border-slate-800 px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <span className="text-amber-500 font-headline text-xl italic font-bold">Ω</span>
            <Link href="/" className="text-white font-headline tracking-tight font-bold hover:text-amber-400 transition-colors">
              RCCG LP17 HQ
            </Link>
            <span className="text-slate-400 font-body text-xs ml-2 uppercase tracking-widest hidden sm:inline">
              / Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-body text-sm hidden md:block">
              {session.email}
            </span>
            <SignOutButton />
          </div>
        </nav>
      )}

      {session && (
        <div className="bg-slate-900 border-b border-slate-800 px-6 md:px-8 py-2">
          <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { label: 'Inbox', href: '/admin/inbox' },
              { label: 'Events', href: '/admin/events' },
              { label: 'Blogs & News', href: '/admin/blogs' },
              { label: 'Partners', href: '/admin/partners' },
              { label: 'Newsletter', href: '/admin/newsletter' },
              { label: 'Give', href: '/admin/give' },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-amber-500 transition-all whitespace-nowrap"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 md:px-8 py-12">
        {children}
      </main>
    </div>
  );
}

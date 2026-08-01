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
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      {session && (
        <nav className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-4 group">
              <img src="/rccg.png" alt="RCCG LP17 HQ Logo" width={150} height={50} className="w-[150px] h-[50px] object-contain" />
            </Link>
            <span className="text-slate-500 font-body text-xs ml-2 uppercase tracking-widest hidden sm:inline">
              / Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500 font-body text-sm hidden md:block">
              {session.email}
            </span>
            <SignOutButton />
          </div>
        </nav>
      )}

      {session && (
        <div className="bg-white border-b border-slate-200 px-6 md:px-8 py-2 shadow-sm">
          <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
            {[
              { label: 'Inbox', href: '/admin/inbox' },
              { label: 'Events', href: '/admin/events' },
              { label: 'Blogs & News', href: '/admin/blogs' },
              { label: 'Partners', href: '/admin/partners' },
              { label: 'Newsletter', href: '/admin/newsletter' },
              { label: 'Give Settings', href: '/admin/give-settings' },
              { label: 'Purpose Page', href: '/admin/purpose' },
              { label: 'Give Projects', href: '/admin/give-projects' },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-amber-500 transition-all whitespace-nowrap"
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

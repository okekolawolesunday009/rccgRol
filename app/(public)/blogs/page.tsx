import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import Link from 'next/link';
import Section from '@/components/SectionProp';
import { desc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blogs & News — RCCG LP17 HQ',
  description: 'Read the latest updates, spiritual resources, and news from River of Life Parish LP17 HQ.',
};

export default async function BlogsPage() {
  const list = await db
    .select()
    .from(blogs)
    .where(eq(blogs.status, 'published'))
    .orderBy(desc(blogs.createdAt));

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">

      <Section bgColor="bg-slate-100" className="py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Blogs & News
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 mb-6 tracking-tight">
            Spiritual insights, announcements, and stories from our sanctuary.
          </h1>
        </div>
      </Section>

      <Section bgColor="bg-white" className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          {list.length === 0 ? (
            <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-2xl">
              <span className="material-symbols-outlined text-5xl mb-4 font-light">book</span>
              <p>No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-950 flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                      </p>
                      <h3 className="text-xl font-headline italic text-white mb-3 group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      href={`/blogs/${post.id}`}
                      className="text-amber-500 text-xs font-bold uppercase tracking-widest hover:underline inline-flex items-center gap-1"
                    >
                      Read More
                      <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

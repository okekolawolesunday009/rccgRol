import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import Section from '@/components/SectionProp';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const list = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, Number(id)))
    .limit(1);

  if (list.length === 0) {
    notFound();
  }

  const post = list[0];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <Section bgColor="bg-slate-950">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="text-amber-500 hover:text-amber-400 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2 mb-8 group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            Back to Blogs
          </Link>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <span className="text-amber-500 font-label text-xs tracking-widest uppercase font-bold">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' }) : ''}
            </span>
            <h1 className="text-4xl md:text-5xl font-headline italic font-bold text-white leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-amber-500/50 pl-4">
              {post.excerpt}
            </p>
          </div>

          {/* Article Thumbnail */}
          {post.thumbnail && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full max-h-[450px] object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-body text-base md:text-lg space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        </div>
      </Section>
    </div>
  );
}

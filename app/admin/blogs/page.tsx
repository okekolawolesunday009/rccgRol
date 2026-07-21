'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string | null;
  status: string;
  createdAt?: string | null;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    status: 'draft',
  });
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, thumbnail: data.url }));
        alert('Thumbnail uploaded successfully!');
      } else {
        alert('Failed to upload thumbnail');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newBlog = await res.json();
        setBlogs((prev) => [newBlog, ...prev]);
        setShowAddModal(false);
        setForm({
          title: '',
          excerpt: '',
          content: '',
          thumbnail: '',
          status: 'draft',
        });
      } else {
        alert('Failed to create blog post');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating blog post');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting blog post');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-headline italic font-bold text-white">Blogs & News</h1>
          <p className="text-slate-400 text-sm mt-1">Publish resources, news, and letters.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Write Article
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">book</span>
          <p className="font-body text-sm">No articles written yet. Create one to share news with the church!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all gap-4"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                    blog.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {blog.status}
                  </span>
                  <p className="text-slate-400 text-xs">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <h3 className="text-white font-headline text-xl italic font-bold mb-2 leading-snug">{blog.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-850 pt-4 mt-auto">
                <span className="text-xs text-slate-500">ID: {blog.id}</span>
                {deleteConfirmId === blog.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={actionLoading}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-slate-400 hover:text-white text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(blog.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Article Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-headline text-xl text-white font-bold">Write Church Article</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Raising Spiritual Giants"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Status *</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Excerpt * (Short summary)</label>
                  <input
                    type="text"
                    required
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="e.g. A brief guide on raising godly children in today's digital age."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Thumbnail Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={form.thumbnail}
                      onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                      placeholder="https://cloudinary.url/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 text-sm"
                    />
                    <label className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer whitespace-nowrap">
                      {uploading ? 'Uploading...' : 'Choose File'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold">Content * (Use double enter for new paragraphs)</label>
                  <textarea
                    required
                    rows={8}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write the full content of the article here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-amber-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : 'Save Article'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-slate-800 text-slate-400 font-bold py-3 rounded-lg hover:border-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

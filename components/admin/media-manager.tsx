'use client';

import { useState, useTransition, useId } from 'react';
import {
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  RefreshCw,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plus,
  ArrowUpDown,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  uploadMediaItem,
  updateMediaItem,
  replaceMediaFile,
  deleteMediaItem,
  syncStorageInventory,
  MediaOperationResult,
} from '@/app/actions/media';

export interface AdminMediaItem {
  id: string;
  storage_path: string;
  filename: string;
  title: string;
  description?: string | null;
  category: string;
  media_type: 'image' | 'video';
  is_visible: boolean;
  file_size?: number | null;
  mime_type?: string | null;
  created_at?: string;
  updated_at?: string;
  url: string;
}

interface MediaManagerProps {
  initialItems: AdminMediaItem[];
  supabaseUrl: string;
}

const CATEGORIES = [
  'Wedding',
  'Pre-Wedding',
  'Portrait',
  'Family',
  'Event',
  'Commercial',
  'Product',
  'Fine Art',
  'Cinema',
  'Studio',
  'Other',
];

export default function MediaManager({ initialItems, supabaseUrl }: MediaManagerProps) {
  const [items, setItems] = useState<AdminMediaItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'visible' | 'hidden'>('all');

  // UI Panels & Modals
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<AdminMediaItem | null>(null);
  const [editModalItem, setEditModalItem] = useState<AdminMediaItem | null>(null);
  const [replaceModalItem, setReplaceModalItem] = useState<AdminMediaItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminMediaItem | null>(null);

  // Status feedback toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload queue
  const [uploadFiles, setUploadFiles] = useState<
    {
      file: File;
      previewUrl: string;
      title: string;
      category: string;
      description: string;
      isVisible: boolean;
      status: 'pending' | 'uploading' | 'done' | 'error';
      error?: string;
    }[]
  >([]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle file selection for upload
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const newEntries = selected.map((file) => {
      const isVideo = file.type.startsWith('video/');
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formattedTitle = nameWithoutExt
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        title: formattedTitle,
        category: isVideo ? 'Cinema' : 'Fine Art',
        description: '',
        isVisible: true,
        status: 'pending' as const,
      };
    });

    setUploadFiles((prev) => [...prev, ...newEntries]);
    setShowUploadPanel(true);
    e.target.value = '';
  };

  // Upload queue runner
  const handleUploadAll = async () => {
    if (uploadFiles.length === 0) return;

    for (let i = 0; i < uploadFiles.length; i++) {
      const item = uploadFiles[i];
      if (item.status === 'done') continue;

      setUploadFiles((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'uploading' } : it))
      );

      const fd = new FormData();
      fd.append('file', item.file);
      fd.append('title', item.title);
      fd.append('category', item.category);
      fd.append('description', item.description);
      fd.append('isVisible', String(item.isVisible));

      const res = await uploadMediaItem(fd);

      if (res.success) {
        setUploadFiles((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'done' } : it))
        );

        // Add newly uploaded item to local list
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/TS_photography/${res.data?.storage_path || item.file.name}`;
        const newItem: AdminMediaItem = {
          id: res.data?.id || String(Date.now()),
          storage_path: res.data?.storage_path || item.file.name,
          filename: item.file.name,
          title: item.title,
          description: item.description,
          category: item.category,
          media_type: item.file.type.startsWith('video/') ? 'video' : 'image',
          is_visible: item.isVisible,
          file_size: item.file.size,
          mime_type: item.file.type,
          created_at: new Date().toISOString(),
          url: publicUrl,
        };
        setItems((prev) => [newItem, ...prev]);
      } else {
        setUploadFiles((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'error', error: res.error } : it
          )
        );
      }
    }

    showToast('success', 'Upload processing completed.');
  };

  // Toggle single item visibility
  const handleToggleVisibility = async (item: AdminMediaItem) => {
    const nextVisibility = !item.is_visible;
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, is_visible: nextVisibility } : it))
    );

    startTransition(async () => {
      const res = await updateMediaItem(item.id, { is_visible: nextVisibility });
      if (!res.success) {
        // Rollback on failure
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, is_visible: item.is_visible } : it))
        );
        showToast('error', res.error || 'Failed to update visibility');
      } else {
        showToast(
          'success',
          `"${item.title}" is now ${nextVisibility ? 'visible in' : 'hidden from'} public portfolio.`
        );
      }
    });
  };

  // Save metadata edit
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editModalItem) return;

    const fd = new FormData(e.currentTarget);
    const title = fd.get('title') as string;
    const category = fd.get('category') as string;
    const description = fd.get('description') as string;
    const isVisible = fd.get('isVisible') === 'on' || fd.get('isVisible') === 'true';

    startTransition(async () => {
      const res = await updateMediaItem(editModalItem.id, {
        title,
        category,
        description,
        is_visible: isVisible,
      });

      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === editModalItem.id
              ? { ...it, title, category, description, is_visible: isVisible }
              : it
          )
        );
        setEditModalItem(null);
        showToast('success', 'Media details saved.');
      } else {
        showToast('error', res.error || 'Failed to save changes.');
      }
    });
  };

  // Replace file
  const handleExecuteReplace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replaceModalItem) return;

    const fd = new FormData(e.currentTarget);
    const file = fd.get('file') as File;
    if (!file || file.size === 0) {
      showToast('error', 'Please select a replacement file.');
      return;
    }

    startTransition(async () => {
      const res = await replaceMediaFile(replaceModalItem.id, fd);
      if (res.success) {
        showToast('success', 'Media file replaced successfully.');
        setReplaceModalItem(null);
        // Refresh page to load updated asset
        window.location.reload();
      } else {
        showToast('error', res.error || 'Replacement failed.');
      }
    });
  };

  // Delete item
  const handleExecuteDelete = async () => {
    if (!deleteConfirmItem) return;

    startTransition(async () => {
      const res = await deleteMediaItem(deleteConfirmItem.id, deleteConfirmItem.storage_path);
      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== deleteConfirmItem.id));
        setDeleteConfirmItem(null);
        showToast('success', `Deleted "${deleteConfirmItem.title}".`);
      } else {
        showToast('error', res.error || 'Deletion failed.');
      }
    });
  };

  // Sync existing root files
  const handleSyncExisting = async () => {
    startTransition(async () => {
      const res = await syncStorageInventory();
      if (res.success) {
        showToast('success', res.message || 'Synced successfully.');
        window.location.reload();
      } else {
        showToast('error', res.error || 'Sync failed.');
      }
    });
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    if (selectedType !== 'all' && item.media_type !== selectedType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedVisibility === 'visible' && !item.is_visible) return false;
    if (selectedVisibility === 'hidden' && item.is_visible) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchFilename = item.filename.toLowerCase().includes(query);
      const matchCategory = item.category.toLowerCase().includes(query);
      if (!matchTitle && !matchFilename && !matchCategory) return false;
    }

    return true;
  });

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 border max-w-md shadow-lg flex items-start space-x-3 transition-all ${
            toast.type === 'success'
              ? 'bg-[#FFFFFF] border-emerald-500 text-[#20201E]'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}
          role="status"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="text-xs font-interface leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#D8D2C8] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#B39A72] mb-1">
            <span className="w-4 h-[1px] bg-[#B39A72]" />
            <span>Supabase Storage Bucket: TS_photography</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#20201E]">
            Media Management
          </h1>
          <p className="mt-2 text-sm text-[#77746F] max-w-xl">
            Upload, preview, organize, and curate photographic works and cinematic reels.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSyncExisting}
            disabled={isPending}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FFFFFF] border border-[#D8D2C8] text-[#20201E] text-xs uppercase tracking-editorial-widest hover:border-[#B39A72] transition-colors disabled:opacity-50"
            title="Scan bucket for existing verified files and ensure they appear in admin"
          >
            <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Sync Bucket</span>
          </button>

          <label className="cursor-pointer inline-flex items-center space-x-2 px-5 py-2.5 bg-[#20201E] text-[#FFFFFF] text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors">
            <Upload size={14} />
            <span>Upload Photos / Reels</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              onChange={handleFilesSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Multi-File Upload Queue Panel */}
      {showUploadPanel && (
        <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#B39A72] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
            <div>
              <h2 className="font-editorial text-2xl text-[#20201E]">Selected Files for Upload</h2>
              <p className="text-xs text-[#77746F]">
                Configure title, category, and public visibility before uploading to Supabase.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadFiles([]);
                setShowUploadPanel(false);
              }}
              className="text-[#77746F] hover:text-[#20201E]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {uploadFiles.map((item, index) => {
              const isVideo = item.file.type.startsWith('video/');

              return (
                <div
                  key={index}
                  className="p-4 bg-[#F7F5F0] border border-[#D8D2C8] grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div className="md:col-span-2 relative aspect-[4/3] bg-[#20201E] overflow-hidden">
                    {isVideo ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#B39A72]">
                        <Video size={24} />
                        <span className="text-[10px] uppercase tracking-wider mt-1">Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="md:col-span-4 space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      placeholder="Display Title"
                      onChange={(e) =>
                        setUploadFiles((prev) =>
                          prev.map((it, idx) =>
                            idx === index ? { ...it, title: e.target.value } : it
                          )
                        )
                      }
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none focus:border-[#20201E]"
                    />
                    <div className="text-[11px] text-[#77746F] truncate">
                      {item.file.name} ({formatFileSize(item.file.size)})
                    </div>
                  </div>

                  {/* Category */}
                  <div className="md:col-span-3">
                    <label className="block text-[10px] uppercase tracking-wider text-[#77746F] mb-1">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        setUploadFiles((prev) =>
                          prev.map((it, idx) =>
                            idx === index ? { ...it, category: e.target.value } : it
                          )
                        )
                      }
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none focus:border-[#20201E]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility & Status */}
                  <div className="md:col-span-3 flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-xs text-[#20201E] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isVisible}
                        onChange={(e) =>
                          setUploadFiles((prev) =>
                            prev.map((it, idx) =>
                              idx === index ? { ...it, isVisible: e.target.checked } : it
                            )
                          )
                        }
                        className="accent-[#B39A72]"
                      />
                      <span className="text-[11px] uppercase tracking-wider">Public</span>
                    </label>

                    <div className="text-right">
                      {item.status === 'uploading' && (
                        <span className="text-xs text-[#B39A72] animate-pulse">Uploading...</span>
                      )}
                      {item.status === 'done' && (
                        <span className="text-xs text-emerald-600 font-medium">Uploaded</span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-xs text-red-600 font-medium">Failed</span>
                      )}
                      {item.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() =>
                            setUploadFiles((prev) => prev.filter((_, idx) => idx !== index))
                          }
                          className="text-[#77746F] hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#D8D2C8]">
            <span className="text-xs text-[#77746F]">
              {uploadFiles.filter((f) => f.status === 'done').length} of {uploadFiles.length} files uploaded
            </span>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer px-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs uppercase tracking-wider text-[#20201E] hover:border-[#20201E]">
                <span>+ Add More Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleUploadAll}
                className="px-6 py-2.5 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors"
              >
                Upload Selected Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77746F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, filename, or category..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] placeholder-[#77746F] focus:outline-none focus:border-[#20201E]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center space-x-1 border border-[#D8D2C8] bg-[#F7F5F0] p-1">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 uppercase tracking-wider text-[11px] transition-colors ${
                selectedType === 'all' ? 'bg-[#20201E] text-white' : 'text-[#77746F]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1 uppercase tracking-wider text-[11px] transition-colors ${
                selectedType === 'image' ? 'bg-[#20201E] text-white' : 'text-[#77746F]'
              }`}
            >
              Photos
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1 uppercase tracking-wider text-[11px] transition-colors ${
                selectedType === 'video' ? 'bg-[#20201E] text-white' : 'text-[#77746F]'
              }`}
            >
              Reels
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Visibility Dropdown */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value as any)}
            className="px-3 py-1.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none"
          >
            <option value="all">All Visibility</option>
            <option value="visible">Visible Only</option>
            <option value="hidden">Hidden Only</option>
          </select>

          <span className="text-[#77746F] pl-2 text-xs">
            {filteredItems.length} of {items.length} items
          </span>
        </div>
      </div>

      {/* Card Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] border border-[#D8D2C8] p-8">
          <ImageIcon size={40} className="mx-auto mb-4 text-[#B39A72] opacity-40" />
          <h3 className="font-editorial text-2xl text-[#20201E] mb-2">No Media Found</h3>
          <p className="text-xs text-[#77746F] max-w-sm mx-auto mb-6">
            {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
              ? 'No media items match your search and filter criteria. Try resetting the filters.'
              : 'Your storage bucket has not been cataloged yet. Click "Sync Bucket" to discover existing files or upload new photos.'}
          </p>
          <button
            type="button"
            onClick={handleSyncExisting}
            className="px-5 py-2.5 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors"
          >
            Sync Bucket Files
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] border border-[#D8D2C8] group hover:border-[#B39A72] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[4/3] bg-[#20201E] overflow-hidden">
                {item.media_type === 'video' ? (
                  <div
                    onClick={() => setPreviewModalItem(item)}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/video bg-[#20201E]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white group-hover/video:scale-110 transition-transform">
                      <Play size={20} className="fill-white ml-0.5" />
                    </div>
                    <span className="text-[11px] text-white/80 uppercase tracking-widest mt-2 font-interface">
                      Preview Reel
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    onClick={() => setPreviewModalItem(item)}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  {/* Category Pill */}
                  <span className="px-2 py-0.5 bg-[#20201E]/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider">
                    {item.category}
                  </span>

                  {/* Visibility Button (interactive) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(item);
                    }}
                    className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-colors ${
                      item.is_visible
                        ? 'bg-emerald-600/90 text-white hover:bg-emerald-700'
                        : 'bg-amber-600/90 text-white hover:bg-amber-700'
                    }`}
                    title={item.is_visible ? 'Visible in Public Portfolio (Click to Hide)' : 'Hidden from Public (Click to Show)'}
                  >
                    {item.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>

                {/* Bottom Overlay: Type & Size */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/80 px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="flex items-center space-x-1 uppercase tracking-wider">
                    {item.media_type === 'video' ? <Video size={11} /> : <ImageIcon size={11} />}
                    <span>{item.media_type}</span>
                  </span>
                  <span>{formatFileSize(item.file_size)}</span>
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial text-lg text-[#20201E] group-hover:text-[#B39A72] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#77746F] font-mono truncate mt-0.5">
                    {item.filename}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#77746F] line-clamp-2 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#D8D2C8] flex items-center justify-between text-xs text-[#77746F]">
                  <button
                    type="button"
                    onClick={() => setPreviewModalItem(item)}
                    className="hover:text-[#20201E] flex items-center space-x-1"
                    title="Full preview"
                  >
                    <Maximize2 size={13} />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditModalItem(item)}
                    className="hover:text-[#20201E] flex items-center space-x-1"
                    title="Edit metadata"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplaceModalItem(item)}
                    className="hover:text-[#B39A72] flex items-center space-x-1"
                    title="Replace file safely"
                  >
                    <RefreshCw size={13} />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmItem(item)}
                    className="hover:text-red-600 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. Lightbox / Preview Modal */}
      {previewModalItem && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewModalItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#FFFFFF] overflow-hidden border border-[#D8D2C8] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-[#D8D2C8] flex items-center justify-between bg-[#F7F5F0]">
              <div>
                <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72]">
                  {previewModalItem.category} &bull; {previewModalItem.media_type}
                </span>
                <h3 className="font-editorial text-2xl text-[#20201E]">
                  {previewModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 text-[#20201E] hover:text-[#B39A72]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Media Canvas */}
            <div className="flex-1 bg-[#111110] flex items-center justify-center min-h-[300px] max-h-[60vh] p-2">
              {previewModalItem.media_type === 'video' ? (
                <video
                  src={previewModalItem.url}
                  controls
                  autoPlay
                  className="max-h-[58vh] max-w-full"
                />
              ) : (
                <img
                  src={previewModalItem.url}
                  alt={previewModalItem.title}
                  className="max-h-[58vh] max-w-full object-contain"
                />
              )}
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 px-6 border-t border-[#D8D2C8] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-4 text-xs text-[#77746F]">
              <div>
                <span className="font-mono text-[#20201E]">{previewModalItem.filename}</span>
                {previewModalItem.description && (
                  <p className="mt-1 text-xs text-[#20201E] max-w-xl">{previewModalItem.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span>Size: {formatFileSize(previewModalItem.file_size)}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    previewModalItem.is_visible
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {previewModalItem.is_visible ? 'Publicly Visible' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Metadata Modal */}
      {editModalItem && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditModalItem(null)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFFFF] border border-[#D8D2C8] p-6 md:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
              <div>
                <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72]">
                  Edit Metadata
                </span>
                <h3 className="font-editorial text-2xl text-[#20201E]">
                  {editModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                className="text-[#77746F] hover:text-[#20201E]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#20201E] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editModalItem.title}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none focus:border-[#20201E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#20201E] mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editModalItem.category}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#20201E] mb-1.5">
                  Description / Caption (optional)
                </label>
                <textarea
                  name="description"
                  defaultValue={editModalItem.description || ''}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none focus:border-[#20201E]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVisible"
                    defaultChecked={editModalItem.is_visible}
                    className="accent-[#B39A72] w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#20201E] block">
                      Visible in Public Portfolio
                    </span>
                    <span className="text-[11px] text-[#77746F]">
                      If unchecked, this item remains in storage but is hidden from the public website.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D8D2C8] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs uppercase tracking-wider text-[#20201E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Replace Media File Modal */}
      {replaceModalItem && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReplaceModalItem(null)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFFFF] border border-[#D8D2C8] p-6 md:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
              <div>
                <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72]">
                  Safe Replacement
                </span>
                <h3 className="font-editorial text-2xl text-[#20201E]">
                  Replace Media File
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReplaceModalItem(null)}
                className="text-[#77746F] hover:text-[#20201E]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#77746F] leading-relaxed">
              Upload a new file to replace <strong>{replaceModalItem.title}</strong> (<code>{replaceModalItem.filename}</code>). The existing metadata and references will be safely maintained.
            </p>

            <form onSubmit={handleExecuteReplace} className="space-y-4">
              <div className="p-6 border-2 border-dashed border-[#D8D2C8] text-center bg-[#F7F5F0]">
                <Upload size={28} className="mx-auto mb-2 text-[#B39A72]" />
                <label className="cursor-pointer block text-xs uppercase tracking-wider text-[#20201E] font-medium hover:text-[#B39A72]">
                  Choose New File
                  <input
                    type="file"
                    name="file"
                    required
                    accept={replaceModalItem.media_type === 'video' ? 'video/mp4' : 'image/jpeg,image/png,image/webp'}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-[#77746F] mt-1">
                  Supported format: {replaceModalItem.media_type === 'video' ? 'MP4 (up to 50MB)' : 'JPEG, PNG, WebP (up to 15MB)'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D8D2C8] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setReplaceModalItem(null)}
                  className="px-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs uppercase tracking-wider text-[#20201E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] disabled:opacity-50"
                >
                  {isPending ? 'Uploading & Replacing...' : 'Execute Replacement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmItem && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmItem(null)}
        >
          <div
            className="w-full max-w-md bg-[#FFFFFF] border border-red-300 p-6 md:p-8 space-y-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle size={24} />
              <h3 className="font-editorial text-2xl text-[#20201E]">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-[#77746F] leading-relaxed">
              Are you sure you want to delete <strong>&ldquo;{deleteConfirmItem.title}&rdquo;</strong> (<code>{deleteConfirmItem.storage_path}</code>)?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-3 border border-red-200">
              This action permanently deletes the object from Supabase Storage bucket <code>TS_photography</code> and its metadata record. It cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs uppercase tracking-wider text-[#20201E]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-editorial-widest transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

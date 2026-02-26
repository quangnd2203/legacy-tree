// src/presentation/components/ClanSettings/PrefaceEditor.tsx
// LT-404: TipTap Rich Text Editor cho bài thơ lời tựa
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

interface PrefaceEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const ToolbarButton = ({ onClick, active, title, children }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`px-2 py-1 rounded text-xs font-bold border transition-all ${active
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
    >
        {children}
    </button>
);

export function PrefaceEditor({ value, onChange }: PrefaceEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[180px] p-4 font-serif text-slate-800 text-sm leading-relaxed outline-none',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Toolbar */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border-b border-slate-100 flex-wrap">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="In đậm"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="In nghiêng"
                >
                    <em>I</em>
                </ToolbarButton>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Căn trái"
                >
                    ≡ Trái
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Căn giữa"
                >
                    ≡ Giữa
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Căn phải"
                >
                    ≡ Phải
                </ToolbarButton>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Danh sách"
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Hoàn tác"
                >
                    ↩ Undo
                </ToolbarButton>
            </div>
            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect, useState } from 'react';
import './simple-editor.css';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="btn-toolbar mb-2 gap-1 p-2 border-bottom bg-light rounded-top">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={` border-0 rounded ${editor.isActive('bold') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Bold"
            >
                <i className="bi bi-type-bold"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={` border-0 rounded ${editor.isActive('italic') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Italic"
            >
                <i className="bi bi-type-italic"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={` border-0 rounded ${editor.isActive('strike') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Strike"
            >
                <i className="bi bi-type-strikethrough"></i>
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={` border-0 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-tertiary' : 'bg-transparent'}`}
                title="H3"
            >
                H3
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={` border-0 rounded ${editor.isActive('bulletList') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Bullet List"
            >
                <i className="bi bi-list-ul"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={` border-0 rounded ${editor.isActive('orderedList') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Ordered List"
            >
                <i className="bi bi-list-ol"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={` border-0 rounded ${editor.isActive('codeBlock') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Code Block"
            >
                <i className="bi bi-code-square"></i>
            </button>
            <div className="vr mx-1"></div>
            <button
                type="button"
                onClick={setLink}
                className={` border-0 rounded ${editor.isActive('link') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Add Link"
            >
                <i className="bi bi-link"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                className="border-0 rounded bg-transparent"
                title="Unlink"
            >
                <i className="bi bi-link-45deg"></i>
            </button>
            <div className="vr mx-1"></div>
            {/* <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={` border-0 rounded ${editor.isActive('blockquote') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Blockquote"
            >
                <i className="bi bi-quote"></i>
            </button> */}
            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={` border-0 rounded ${editor.isActive('horizontalRule') ? 'bg-tertiary' : 'bg-transparent'}`}
                title="Horizontal Rule"
            >
                <i className="bi bi-hr"></i>
            </button>
        </div>
    );
};

export const SimpleEditor = ({ content, onChange, isRequired = false }) => {
    // Force re-render on transaction to update toolbar state
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Trigger re-render on selection updates and other transactions so buttons update
        onTransaction: () => {
            forceUpdate(prev => prev + 1);
        },
    });

    // Sync external content changes (e.g. from AI or initial load)
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            // Only update if focused to avoid overwriting while typing, 

            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div className="border rounded-3 simple-editor-wrapper position-relative" style={{ minHeight: '320px' }}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-3" style={{ minHeight: '280px' }} />

            {/* Hidden input for form validation */}
            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0, position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none' }}
                required={isRequired}
                value={editor && !editor.isEmpty ? 'valid' : ''}
                onChange={() => { }}
                onInvalid={(e) => e.preventDefault()}
            />
            {editor && editor.isEmpty && isRequired && <div className="invalid-feedback">Please provide content</div>}
        </div>
    );
};

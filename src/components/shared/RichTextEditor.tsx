import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code } from 'lucide-react';
import { cn } from '../../lib/cn';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !readOnly,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className='rounded-card border border-line-base bg-bg-sunken overflow-hidden focus-within:border-clay-500/50 transition-colors'>
      {!readOnly && (
        <div className='flex flex-wrap gap-1 px-3 py-2 border-b border-line-subtle bg-bg-overlay/40'>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title='Bold'
          >
            <Bold size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title='Italic'
          >
            <Italic size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title='Heading 2'
          >
            <Heading2 size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title='Heading 3'
          >
            <Heading3 size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title='Bullet list'
          >
            <List size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title='Numbered list'
          >
            <ListOrdered size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title='Blockquote'
          >
            <Quote size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title='Inline code'
          >
            <Code size={14} strokeWidth={2} />
          </ToolbarButton>
        </div>
      )}
      <EditorContent
        editor={editor}
        className={cn(
          'px-4 py-3 min-h-[160px] font-body text-sm text-ink-primary',
          '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[140px]',
          '[&_.ProseMirror_p]:my-2 [&_.ProseMirror_p]:leading-[1.6]',
          '[&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:text-ink-primary [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:mb-2',
          '[&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:text-ink-primary [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1.5',
          '[&_.ProseMirror_strong]:font-semibold [&_.ProseMirror_strong]:text-ink-primary',
          '[&_.ProseMirror_em]:italic',
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:my-2',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:my-2',
          '[&_.ProseMirror_li]:my-1',
          '[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-clay-500 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-ink-secondary [&_.ProseMirror_blockquote]:my-3',
          '[&_.ProseMirror_code]:bg-bg-overlay [&_.ProseMirror_code]:text-clay-400 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-xs',
          '[&_.ProseMirror_a]:text-clay-400 [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 hover:[&_.ProseMirror_a]:text-clay-500',
          '[&_.ProseMirror_p.is-editor-empty:first-child]:relative',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-ink-tertiary',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:italic',
        )}
      />
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, active, title, children }: ToolbarButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    title={title}
    aria-pressed={active}
    className={cn(
      'inline-grid place-items-center h-8 w-8 rounded-md transition-[background-color,color,border-color] duration-base ease-out-quart',
      active
        ? 'bg-clay-500/15 text-clay-400 border border-clay-500/30'
        : 'text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay/60 border border-transparent',
    )}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <span aria-hidden className='self-stretch w-px bg-line-subtle mx-1' />
);

export default RichTextEditor;

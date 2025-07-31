import { EditorContent } from "@tiptap/react";
import { EditorToolbar } from "./editor-toolbar";
import { useEditor } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { ImageUploadNode } from "../tiptap-node/image-upload-node";

const extensions = [
  TextStyleKit,
  StarterKit,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  TextAlign,
  TableKit.configure({
    table: { resizable: true },
  }),
  Image,
  ImageUploadNode.configure({
    accept: "image/*",
    maxSize: 1024 * 1024 * 10,
    limit: 3,
    upload: async (file: File) => {
      console.log(file);
      return URL.createObjectURL(file);
    },
    onError: (error) => console.error("Upload failed:", error),
  }),
];

export const Editor = () => {
  const editor = useEditor({
    extensions,
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>
<blockquote>
  Wow, that's amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="h-[calc(100dvh-58px)] overflow-x-hidden overflow-y-auto flex flex-col-reverse md:flex-col">
      <EditorToolbar editor={editor} />
      {/* <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 rounded-lg border bg-popover p-1 shadow-md"
      >
        <Button
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon className="h-4 w-4" />
        </Button>
      </BubbleMenu> */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto h-[calc(100dvh-106px)]">
        <EditorContent editor={editor} className="app-editor" />
      </div>
    </div>
  );
};

import { Editor, useEditorState } from "@tiptap/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  XIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Code2,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Table,
  Plus,
  Trash2,
  Merge,
  Split,
  Underline,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";

export function EditorToolbar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isTaskList: ctx.editor.isActive("taskList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        textAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        textAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        textAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        textAlignJustify:
          ctx.editor.isActive({ textAlign: "justify" }) ?? false,
        isTable: ctx.editor.isActive("table") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="h-12 flex items-center justify-center bg-sidebar border-b-0 border-t md:border-b md:border-t-0 border-border sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={
                editorState.isHeading1 ||
                editorState.isHeading2 ||
                editorState.isHeading3 ||
                editorState.isHeading4 ||
                editorState.isHeading5 ||
                editorState.isHeading6
                  ? "secondary"
                  : "ghost"
              }
            >
              <Heading1 />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={editorState.isHeading1 ? "bg-accent" : ""}
            >
              <Heading1 className="h-4 w-4" />
              <span>Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={editorState.isHeading2 ? "bg-accent" : ""}
            >
              <Heading2 className="h-4 w-4" />
              <span>Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={editorState.isHeading3 ? "bg-accent" : ""}
            >
              <Heading3 className="h-4 w-4" />
              <span>Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={editorState.isHeading4 ? "bg-accent" : ""}
            >
              <Heading4 className="h-4 w-4" />
              <span>Heading 4</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={editorState.isHeading5 ? "bg-accent" : ""}
            >
              <Heading5 className="h-4 w-4" />
              <span>Heading 5</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={editorState.isHeading6 ? "bg-accent" : ""}
            >
              <Heading6 className="h-4 w-4" />
              <span>Heading 6</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={
                editorState.textAlignLeft ||
                editorState.textAlignCenter ||
                editorState.textAlignRight ||
                editorState.textAlignJustify
                  ? "secondary"
                  : "ghost"
              }
            >
              <AlignLeft className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editorState.textAlignLeft ? "bg-accent" : ""}
            >
              <AlignLeft className="h-4 w-4" />
              <span>Left</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={editorState.textAlignCenter ? "bg-accent" : ""}
            >
              <AlignCenter className="h-4 w-4" />
              <span>Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={editorState.textAlignRight ? "bg-accent" : ""}
            >
              <AlignRight className="h-4 w-4" />
              <span>Right</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={editorState.textAlignJustify ? "bg-accent" : ""}
            >
              <AlignJustify className="h-4 w-4" />
              <span>Justify</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <Button
          variant={editorState.isBulletList ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </Button>

        <Button
          variant={editorState.isOrderedList ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </Button>

        <Button
          variant={editorState.isTaskList ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare />
        </Button>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <Button
          variant={editorState.isBold ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
        >
          <BoldIcon />
        </Button>

        <Button
          variant={editorState.isItalic ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
        >
          <ItalicIcon />
        </Button>

        <Button
          variant={editorState.isUnderline ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState.canUnderline}
        >
          <Underline />
        </Button>

        <Button
          variant={editorState.isCode ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
        >
          <CodeIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <XIcon />
        </Button>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setImageUploadNode().run()}
        >
          <ImageIcon />
        </Button>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <Button
          variant={editorState.isCodeBlock ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 />
        </Button>

        <Button
          variant={editorState.isBlockquote ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </Button>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={editorState.isTable ? "secondary" : "ghost"}>
              <Table />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <Plus className="h-4 w-4" />
              <span>Insert Table</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <Plus className="h-4 w-4" />
              <span>Add Column Before</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Plus className="h-4 w-4" />
              <span>Add Column After</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Column</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <Plus className="h-4 w-4" />
              <span>Add Row Before</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Plus className="h-4 w-4" />
              <span>Add Row After</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Row</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Table</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              <Merge className="h-4 w-4" />
              <span>Merge Cells</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              <Split className="h-4 w-4" />
              <span>Split Cell</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              <Table className="h-4 w-4" />
              <span>Toggle Header Column</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              <Table className="h-4 w-4" />
              <span>Toggle Header Row</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            >
              <Table className="h-4 w-4" />
              <span>Toggle Header Cell</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="block data-[orientation=vertical]:h-6 bg-sidebar-border"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <RotateCcw />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <RotateCw />
        </Button>
      </div>
    </div>
  );
}

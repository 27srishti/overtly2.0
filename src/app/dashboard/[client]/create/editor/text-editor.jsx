"use client";
import { useEffect, useState } from "react";

/* Lexical Design System */
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

/* Lexical Plugins Local */
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";

/* Lexical Plugins Remote */
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

/* Lexical Others */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ExampleTheme from "./themes/ExampleTheme";
import { copyToClipboard } from "@lexical/clipboard";
/* Lexical Texts */
import { textDailyStandup } from "./text-daily-standup";
import {
  $getRoot,
  $getSelection,
  $setSelection,
  $isRangeSelection,
  $createRangeSelection,
  $createTextNode
} from 'lexical';
import { $selectAll } from '@lexical/selection';
import CopyPlugin from './plugins/CopyPlugin';
function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

import "./editorstyle.css";

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  namespace: "daily-standup-editor",
  editorState: textDailyStandup,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    // ExtendedTextNode,
    // { replace: TextNode, with: (node) => new ExtendedTextNode(node.__text) },
    // ListNode,
    // ListItemNode,
  ],
};

export function EditorPage() {
  const [isMounted, setIsMounted] = useState(false);
  // const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const onChange = (editorState, editor) => {
  //   setEditorInstance(editor);
  // };

  // const selectAndCopyAll = () => {
  //   if (!editorInstance) return;

  //   editorInstance.update(async () => {
  //     const root = $getRoot();
  //     const selection = $createRangeSelection();
  //     selection.anchor.set(root.getKey(), 0, 'element');
  //     selection.focus.set(root.getKey(), root.getChildrenSize(), 'element');
  //     $setSelection(selection);

  //     // Copy to clipboard
  //    await copyToClipboard(editorInstance ,null);
  //   });
  // };

  if (!isMounted) return null;

  return (
    <div className="h-full">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ListPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <LinkPlugin />
            <TabIndentationPlugin />
            <AutoLinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
          <div className="flex items-end justify-end mt-2">
            <CopyPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}

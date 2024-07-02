'use client';

import { useEffect, useState } from "react";

/* Lexical Design System */
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";

/* Lexical Plugins Local */
import TreeViewPlugin from "../editor/plugins/TreeViewPlugin";
import ToolbarPlugin from "../editor/plugins/ToolbarPlugin";
import AutoLinkPlugin from "../editor/plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "../editor/plugins/CodeHighlightPlugin";

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
/* Lexical Texts */
import { textDailyStandup } from "./text-daily-standup";

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}
import "./editorstyle.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { copyToClipboard } from "@lexical/clipboard";

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    namespace: "daily-standup-editor",
    editorState: textDailyStandup,
    // Handling of errors during update
    onError(error: unknown) {
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
        LinkNode
    ],
};

function MyOnChangePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const json = editorState.toJSON();
                console.log('Editor State:', json);
            });
        });
    }, [editor]);

    const handleCopyToClipboard = async () => {
        try {
            const success = await copyToClipboard(editor,null);
            if (success) {
                console.log('Content copied to clipboard successfully.');
            } else {
                console.error('Failed to copy content to clipboard.');
            }
        } catch (error) {
            console.error('Error copying content to clipboard:', error);
        }
    };


    return null;
}

export  function EditorPage(): JSX.Element | null {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (!isMounted) return null;

    return (
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
                    <MyOnChangePlugin />
                    {/* <TreeViewPlugin /> */}
                </div>
                <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
            </div>
        </LexicalComposer>
    );
}
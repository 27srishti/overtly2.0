import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $getRoot, $getSelection, $normalizeSelection__EXPERIMENTAL, $setSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';

const CopyPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const handleCopy = () => {
        editor.update(async () => {
            const root = $getRoot();
            const selection = root.select(0, root.getChildrenSize());
            $setSelection($normalizeSelection__EXPERIMENTAL(selection));

            const currentSelection = $getSelection();
            if (currentSelection) {
                const plainText = currentSelection.getTextContent();
                const htmlString = $generateHtmlFromNodes(editor, currentSelection);

                try {
                    await navigator.clipboard.writeText(plainText);
                    console.log('Plain text copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy plain text: ', err);
                }

                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'text/plain': new Blob([plainText], { type: 'text/plain' }),
                            'text/html': new Blob([htmlString], { type: 'text/html' })
                        })
                    ]);
                    console.log('HTML content copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy HTML content: ', err);
                }
            }
        });
    };

    return (
        <button onClick={handleCopy} className='bg-[#5C5C5C] rounded-full px-5 py-3 text-white text-sm '>
            Copy Email
        </button>
    );
};

export default CopyPlugin;

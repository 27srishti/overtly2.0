import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { useEffect, useRef } from 'react';

const SetInitialText = (props) => {
    const { pitchEmail } = props
    const [editor] = useLexicalComposerContext();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            editor.update(() => {
                const paragraph = $createParagraphNode();
                const text = $createTextNode(pitchEmail);
                paragraph.append(text);
                $getRoot().append(paragraph);
                $getRoot().selectEnd();
            });
            hasInitialized.current = true;
        }
    }, [editor]);

    return null;
};

export default SetInitialText;

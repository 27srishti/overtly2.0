"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 480)}px`;
      }
    };

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height initially
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 480)}px`;
      }
    }, [props.value]); // Adjust height when value changes

    return (
      <textarea
        {...props}
        ref={(node) => {
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          textareaRef.current = node;
        }}
        className={cn(
          "flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={adjustTextareaHeight}
        style={{
          minHeight: '40px', // Minimum height reduced to 40px
          maxHeight: '480px', // Maximum height (30rem or 480px)
          resize: 'none', // Disable manual resizing
        }}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

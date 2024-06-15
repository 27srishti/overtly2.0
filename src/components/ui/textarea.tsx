"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 480)}px`;
      }
    };

    React.useEffect(() => {
      adjustTextareaHeight(); // Initial adjustment of textarea height
    }, []);

    // Expose textareaRef to the parent component through the forwarded ref
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustTextareaHeight();
      if (onChange) {
        onChange(event); // Call the onChange prop if it exists
      }
    };

    return (
      <textarea
        {...props}
        ref={textareaRef}
        className={cn(
          "flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={handleChange}
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

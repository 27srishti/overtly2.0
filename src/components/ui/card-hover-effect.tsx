import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface BentoItem {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

interface HoverEffectProps {
  items: BentoItem[];
  className?: string;
  render?: (item: BentoItem) => React.ReactNode; // Add this line
}

export const HoverEffect = ({
  items,
  className,
  render,  // Add this to props
}: HoverEffectProps) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {items.map((item, idx) => (
        <Link
          href={item.link}
          key={idx}
          className="relative overflow-hidden rounded-lg border bg-gray-100/50 p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gray-200/50 block rounded-lg z-0"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          {render ? (
            render(item)
          ) : (
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6 relative z-10">
              {item.icon}
              <div className="space-y-2">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          )}
        </Link>
      ))}
    </>
  );
};
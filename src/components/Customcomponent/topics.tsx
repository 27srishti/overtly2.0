// topics.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import "./topics.css";

interface Subtopic {
  name: string;
  subtopics?: Subtopic[];
}

interface Topic {
  name: string;
  subtopics?: Subtopic[];
}

interface TopicsPopupProps {
  topics: Topic[];
  isOpen: boolean;
  onClose: () => void;
}

export const TopicsPopup: React.FC<TopicsPopupProps> = ({
  topics,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const renderSubtopics = (subtopics: Subtopic[], level: number) => {
    return (
      <div className={`branch lv${level}`}>
        {subtopics.map((subtopic, subIndex) => (
          <div key={subIndex} className="entry">
            <span className="label">{subtopic.name}</span>
            {subtopic.subtopics &&
              subtopic.subtopics.length > 0 &&
              renderSubtopics(subtopic.subtopics, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 text-xs bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 mx-4 my-8 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-start">
            <h3 className="border border-yellow-300 rounded-full px-8 py-2">
              Topics
            </h3>
          </div>
          <div id="wrapper" className="relative ml-12">
            {topics.map((topic, index) => (
              <div key={index} className="entry">
                <span className="label">{topic.name}</span>
                {topic.subtopics &&
                  topic.subtopics.length > 0 &&
                  renderSubtopics(topic.subtopics, 1)}
              </div>
            ))}
          </div>
        </div>
        <Button onClick={onClose} className="mt-4 self-center">
          Close
        </Button>
      </div>
    </div>
  );
};
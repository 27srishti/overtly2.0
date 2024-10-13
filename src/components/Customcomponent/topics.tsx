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
    const isSingleSubtopic = subtopics.length === 1;
    return (
      <div
        className={`branch lv${level} ${
          isSingleSubtopic ? "single-subtopic" : ""
        }`}
      >
        {subtopics.map((subtopic, subIndex) => (
          <div
            key={subIndex}
            className={`entry ${isSingleSubtopic ? "inline" : ""}`}
          >
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-[90%] mx-4 my-8 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
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
        <div
          className="absolute top-6 right-5 cursor-pointer"
          onClick={onClose}
        >
          <img
            width="20"
            className="opacity-70 hover:opacity-100"
            height="20"
            src="https://img.icons8.com/material-two-tone/24/delete-sign.png"
            alt="delete-sign"
          />
        </div>
      </div>
    </div>
  );
};

// PR-99/src/app/dashboard/[client]/datalibrary/topics.tsx

import React from "react";
import { Button } from "@/components/ui/button";

interface Subtopic {
  name: string;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 mx-4 my-8 flex flex-col">
        <div className="flex items-start mb-4">
          <h3 className="bg-yellow-200 border border-yellow-300 mb-2 ml-2 rounded-full px-6 py-1">
            Topics
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="relative ml-4">
            {topics.map((topic, index) => (
              <div key={index} className="flex flex-col items-start mb-6 ml-8">
                <div className="flex items-center">
                  <div className="w-40 h-4 border-b-[1px] border-l-[1px] border-dashed border-gray-400"></div>
                  <a className="border border-yellow-500 mb-2 ml-2 rounded-full px-4 py-1 ">
                    {topic.name}
                  </a>
                </div>
                {topic.subtopics && topic.subtopics.length > 0 && (
                  <div className="ml-8">
                    {topic.subtopics.map((subtopic, subIndex) => (
                      <div key={subIndex} className="flex items-center">
                        <div className="w-60 h-4 border-b-[1px] border-l-[1px] border-dashed border-gray-400"></div>
                        <a className="border border-yellow-500 mb-2 ml-2 rounded-full px-4 py-1 ">
                          {subtopic.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
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
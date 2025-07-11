"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

interface ContentProps {
  onChange: (content: string) => void;
  initialContent?: string;
}

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const editorOptions = {
  buttonList: [
    [
      "formatBlock",
      "bold",
      "underline",
      "italic",
      "blockquote",
      "fontColor",
      "hiliteColor",
      "textStyle",
      "removeFormat",
      "align",
      "horizontalRule",
      "list",
      "lineHeight",
      "table",
      "link",
      "image",
      "video",
      "audio",
      "codeView",
    ],
  ],
};

const Content: React.FC<ContentProps> = ({
  onChange,
  initialContent = "", // Default value for initialContent
}) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (content: string) => {
    setContent(content);
    onChange(content);
  };

  useEffect(() => {
    setContent(initialContent); // Set initial content on mount
  }, [initialContent]);

  return (
    <div>
      <SunEditor
        setContents={content} // Initialize SunEditor with the content
        onChange={handleChange}
        setOptions={editorOptions}
      />
    </div>
  );
};

export default Content;

"use client"

import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"


export function CodeEditor({ language = "javascript", className, ...props }) {
  const [code, setCode] = React.useState("")

  return (
    <div className={className}>
      {/* <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
          height: "300px",
          overflow: "auto",
        }}
      >
        {code}
      </SyntaxHighlighter> */}
      <textarea
        {...props}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-gray-800 text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}


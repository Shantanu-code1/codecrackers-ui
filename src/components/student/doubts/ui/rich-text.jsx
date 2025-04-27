import React from "react"
import { Editor } from "@tinymce/tinymce-react"

export function RichTextEditor({ className, ...props }) {
  return (
    <Editor
      apiKey="gm5zz4kqrgp3cbyzlfo5bdr1z0iw0vyneaupdnoomgq5br9c"
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help",
      }}
      {...props}
    />
  )
}


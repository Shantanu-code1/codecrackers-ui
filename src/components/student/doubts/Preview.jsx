import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export function PreviewDoubt({ title, categories, description, codeSnippet }) {
  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo-900">{title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
        {codeSnippet && (
          <div className="bg-gray-800 text-white p-4 rounded-md">
            <pre>
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


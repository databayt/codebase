/**
 * Test file to verify template system functionality
 */

import { templates } from "./registry-templates"
import LoginTemplate from "@/components/template/login-01/page"

export function TestTemplateSystem() {
  const loginTemplate = templates.find(t => t.name === "login-01")

  if (!loginTemplate) {
    return <div>Template system error: login-01 not found in registry</div>
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Template System Test</h2>
        <div className="space-y-2">
          <p>✅ Registry loaded: {templates.length} templates found</p>
          <p>✅ Login template found: {loginTemplate.name}</p>
          <p>✅ Description: {loginTemplate.description}</p>
          <p>✅ Categories: {loginTemplate.categories?.join(", ")}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Template Preview:</h3>
        <div className="border rounded-lg p-4 bg-muted/50">
          <LoginTemplate />
        </div>
      </div>
    </div>
  )
}
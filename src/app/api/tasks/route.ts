import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const query = `
      query {
        node(id: "PVT_kwHOAEKbKs4BOmu8") {
          ... on ProjectV2 {
            title
            items(first: 50) {
              nodes {
                id
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldTextValue { text field { ... on ProjectV2Field { name } } }
                    ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } }
                    ... on ProjectV2ItemFieldDateValue { date field { ... on ProjectV2Field { name } } }
                    ... on ProjectV2ItemFieldNumberValue { number field { ... on ProjectV2Field { name } } }
                  }
                }
                content {
                  ... on Issue {
                    title
                    url
                    state
                    labels(first: 5) { nodes { name color } }
                    assignees(first: 3) { nodes { login } }
                    body
                    createdAt
                    updatedAt
                  }
                  ... on DraftIssue {
                    title
                    body
                    createdAt
                    updatedAt
                  }
                }
              }
            }
          }
        }
      }
    `
    const result = execSync(`gh api graphql -f query='${query.replace(/'/g, "'\\''")}'`, {
      encoding: 'utf-8',
      timeout: 15000,
    })
    const data = JSON.parse(result)
    const project = data.data.node

    const tasks = project.items.nodes.map((item: any) => {
      const fields: Record<string, any> = {}
      for (const fv of item.fieldValues.nodes) {
        if (fv.field?.name) {
          fields[fv.field.name] = fv.text || fv.name || fv.date || fv.number
        }
      }
      const content = item.content || {}
      return {
        id: item.id,
        title: content.title || fields['Title'] || 'Untitled',
        status: fields['Status'] || content.state || 'Unknown',
        priority: fields['Priority'] || null,
        url: content.url || null,
        labels: content.labels?.nodes || [],
        assignees: content.assignees?.nodes?.map((a: any) => a.login) || [],
        body: content.body || '',
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      }
    })

    return NextResponse.json({ title: project.title, tasks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, tasks: [] }, { status: 500 })
  }
}

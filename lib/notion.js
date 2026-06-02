import { NotionAPI } from 'notion-client'

// Unofficial Notion client — reads PUBLICLY shared pages by id, no token needed.
// Make sure the Notion "Home" page is shared with "anyone with the link".
export const notion = new NotionAPI()

// The unofficial API can return malformed block entries (missing `value` or
// `value.id`). react-notion-x calls `uuidToId(block.id)` for every block, so a
// missing id throws "Cannot read properties of undefined (reading 'replace')"
// and crashes the whole prerender. Drop those entries; any parent that points
// at a dropped block simply renders nothing there.
function sanitizeRecordMap(recordMap) {
  if (recordMap && recordMap.block) {
    for (const key of Object.keys(recordMap.block)) {
      const entry = recordMap.block[key]
      if (!entry || !entry.value || !entry.value.id) {
        delete recordMap.block[key]
      }
    }
  }
  return recordMap
}

export async function getNotionPage(pageId) {
  const recordMap = await notion.getPage(pageId)
  return sanitizeRecordMap(recordMap)
}

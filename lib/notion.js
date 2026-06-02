import { NotionAPI } from 'notion-client'

// Unofficial Notion client — reads PUBLICLY shared pages by id, no token needed.
// Make sure the Notion "Home" page is shared with "anyone with the link".
export const notion = new NotionAPI()

// Pages published via Notion "Sites" return a newer record shape where the
// real record is nested one level deeper: `block[id].value.value` instead of
// `block[id].value`. notion-client / react-notion-x 6.16.0 expect the flat
// shape, so without this they read `block.id` as undefined and crash
// (uuidToId(undefined).replace). Unwrap the extra `.value` for every record map.
function unwrapNested(map) {
  if (!map) return
  for (const key of Object.keys(map)) {
    const entry = map[key]
    if (
      entry &&
      entry.value &&
      entry.value.value &&
      typeof entry.value.value === 'object' &&
      entry.value.value.id
    ) {
      entry.value = entry.value.value
    }
  }
}

function normalizeRecordMap(recordMap) {
  if (!recordMap) return recordMap
  unwrapNested(recordMap.block)
  unwrapNested(recordMap.collection)
  unwrapNested(recordMap.collection_view)
  unwrapNested(recordMap.notion_user)
  unwrapNested(recordMap.space)
  return recordMap
}

// After normalizing, drop any block entry still missing `value.id` so a single
// malformed record can't crash the whole prerender.
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
  return sanitizeRecordMap(normalizeRecordMap(recordMap))
}

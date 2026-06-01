import { NotionAPI } from 'notion-client'

// Unofficial Notion client — reads PUBLICLY shared pages by id, no token needed.
// Make sure the Notion "Home" page is shared with "anyone with the link".
export const notion = new NotionAPI()

export async function getNotionPage(pageId) {
  return notion.getPage(pageId)
}

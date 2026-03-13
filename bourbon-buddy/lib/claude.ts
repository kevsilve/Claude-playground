import Anthropic from '@anthropic-ai/sdk'
import type { BottleData } from './types'

const client = new Anthropic()

const BOTTLE_IDENTIFICATION_PROMPT = `You are an expert bourbon and whiskey sommelier with encyclopedic knowledge of American whiskey.

Analyze this image carefully. It may show:
- A bourbon/whiskey bottle (front or back label)
- A barcode (read the barcode value and identify the product)
- A partial label or box

Identify the whiskey and respond ONLY with valid JSON — no markdown, no extra text:

{
  "name": "full product name",
  "distillery": "distillery or producer name",
  "age": "age statement or NAS",
  "proof": 90,
  "mashBill": "grain composition if known",
  "region": "Kentucky / Tennessee / etc.",
  "type": "Bourbon / Rye / Wheated Bourbon / etc.",
  "flavorNotes": ["vanilla", "caramel", "oak", "dried fruit", "spice"],
  "description": "2-3 sentence description of style and character",
  "priceRange": "$40-55",
  "confidence": "high"
}

If you cannot identify the bottle, return:
{"error": "Could not identify bottle", "confidence": "low"}`

export async function scanBottle(imageBase64: string, mimeType: string): Promise<BottleData> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: BOTTLE_IDENTIFICATION_PROMPT,
          },
        ],
      },
    ],
  })

  const text = (response.content[0] as { type: string; text: string }).text
  return JSON.parse(text) as BottleData
}

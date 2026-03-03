import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function main(prompt,tone,length,format) {
  
  const systemPrompt = `
    You are a blog content generator.
    Write in a ${tone} tone.
    Length: ${length}.
    Format: ${format}.
    Topic: ${prompt}.
    Generate a plain HTML ONLY (no markdown, no code fences ) content (paragraphs, headings, lists) that can be inserted into a blog editor.
    Format requirements:
    Use clean HTML with <h1>, <h2>, <h3>, and <p> tags for structure.
    Do NOT use <ul>, <ol>, or <li>.
    Instead, when you need a list, write it as plain text inside <p>, with each item starting with '-' or '•'.
    Do not wrap lists in extra HTML tags, just simple <p> blocks with dashes or bullets.
     Do not include any  fences or code blocks.
    Ensure the content is well-structured, readable, and visually appealing when rendered in a blog.
  `;

  // Call Gemini
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ type: "text", text: systemPrompt }],
  });

  
// console.log("Gemini raw response:", JSON.stringify(result, null, 2));
 return result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export default main;

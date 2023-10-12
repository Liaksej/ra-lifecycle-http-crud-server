import type { VercelRequest, VercelResponse } from "@vercel/node";

import { v4 as uuidv4 } from "uuid";
import { kv } from "@vercel/kv";

type Note = {
  id: string;
  content: string;
};

export default async function (
  request: VercelRequest,
  response: VercelResponse,
) {
  console.log(`Received ${request.method} request`);

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  let notes: Note[] = (await kv.get("notes")) || [];

  switch (request.method?.toUpperCase()) {
    case "GET":
      return response.status(200).json(await kv.get("notes"));
    case "POST":
      notes.push({
        id: uuidv4(),
        content: request.body.content,
      });
      await kv.set("notes", notes);
      return response.status(201).json(notes.at(-1));
    case "DELETE":
      if (!request.query.id) {
        return response.status(400).send("No note id provided");
      }
      notes = notes.filter((note: Note) => note.id !== request.query.id);
      await kv.set("notes", notes);
      return response.status(200).send("Note deleted");
    default:
      return response.status(405).send("Not allowed");
  }
}

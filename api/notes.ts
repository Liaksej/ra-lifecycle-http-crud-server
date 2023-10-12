import type { VercelRequest, VercelResponse } from "@vercel/node";

import { v4 as uuidv4 } from "uuid";

type Note = {
  id: string;
  content: string;
};

export default function (request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE",
  );
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  switch (request.method?.toUpperCase()) {
    case "GET":
      return response.status(200).json(sendNotes());
    case "POST":
      notesArray.push({
        id: uuidv4(),
        content: request.body.content,
      });
      return response.status(201).json(notesArray.at(-1));
    case "DELETE":
      if (!request.query.id) {
        return response.status(400).send("No note id provided");
      }
      notesArray = notesArray.filter((note) => note.id !== request.query.id);
      return response.status(200).send("Note deleted");
    default:
      return response.status(405).send("Not allowed");
  }
}

let notesArray: Note[] = [];

function sendNotes() {
  return notesArray;
}

import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { author_id } = params;
    const response = await repo.readPaperByAuthor(author_id);
    if (response.done) {
      return NextResponse.json(response.papers);
    } else {
      return NextResponse.json({
        error: "papers not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

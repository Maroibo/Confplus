import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function PUT(request, { params }) {
  try {
    let { id } = params;
    const author = await request.json();
    const response = await repo.updateAuthor(id, author);
    if (response.done) {
      return NextResponse.json(response.author);
    } else {
      return NextResponse.json({
        error: "authorPaper not created",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

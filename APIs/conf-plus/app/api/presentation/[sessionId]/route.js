import { NextResponse } from "next/server";
import * as repo from "../../repository.js";

export async function DELETE(request, { params }) {
    try {
      let { sessionId } = params;
      const response = await repo.deletePresentations(parseInt(sessionId));
      if (response.done) {
        return NextResponse.json(response.presentations);
      } else {
        return NextResponse.json({
          error: "presentations not deleted",
        });
      }
    } catch (err) {
      console.log(err);
    }
}

export async function POST(request, { params }) {
  try {
    let { sessionId } = params;
    const presentationsState = await request.json();
    const response = await repo.createPresentations(presentationsState);
    if (response.done) {
      return NextResponse.json(response.presentations);
    } else {
      return NextResponse.json({
        error: "presentations not created",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
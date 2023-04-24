import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.readConference(id);
    if (response.done) {
      return NextResponse.json(response.conference);
    } else {
      return NextResponse.json({
        error: "Conference not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// api/conference/[id]


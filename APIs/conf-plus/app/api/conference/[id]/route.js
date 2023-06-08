import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.readConference(parseInt(id));
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

export async function PUT(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.updateConference(id, await request.json());
    if (response.done) {
      return NextResponse.json(response.conference);
    } else {
      return NextResponse.json({
        error: "conference not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export async function POST(request, { params }) {
  try {
    let { id } = params;
    const session = await request.json();
    const response = await repo.createSession(id, session);
    if (response.done) {
      return NextResponse.json(response.session);
    } else {
      return NextResponse.json({
        error: "session not created",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
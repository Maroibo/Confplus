import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    id = parseInt(id);
    const response = await repo.readPaper(id);
    if (response.done) {
      return NextResponse.json(response.paper);
    } else {
      return NextResponse.json({
        error: "paper not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function POST(request, { params }) {
  try {
    let { id } = params;
    id = parseInt(id);
    const paper = await request.json();
    const response = await repo.updatePaper(id, paper);
    if (response.done) {
      return NextResponse.json(response.paper);
    } else {
      return NextResponse.json({
        error: "paper not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function DELETE(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.deletePaper(id);
    if (response.done) {
      return NextResponse.json(response.paper);
    } else {
      return NextResponse.json({
        error: "paper not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

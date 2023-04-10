import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function POST(request) {
  try {
    const paper = await request.json();
    const response = await repo.createPaper(paper);
    if (response.done) {
      return NextResponse.json(response.paper);
    } else {
      return NextResponse.json({
        error: "paper not created",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function GET(request) {
  try {
    const response = await repo.readAllPapers();
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

import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const response = await repo.readAllReviews();
    if (response.done) {
      return NextResponse.json(response.reviews);
    } else {
      return NextResponse.json({
        error: "internal server error",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function POST(request) {
  try {
    const {paper_id} = await request.json();
    const response = await repo.createReviews(paper_id);
    if (response.done) {
      return NextResponse.json(response.reviews);
    } else {
      return NextResponse.json({
        error: "your review is not valid",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

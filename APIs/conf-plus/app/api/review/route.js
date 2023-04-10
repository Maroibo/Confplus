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
    const review = await request.json();
    const response = await repo.createReview(review);
    if (response.done) {
      return NextResponse.json(response.review);
    } else {
      return NextResponse.json({
        error: "your review is not valid",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

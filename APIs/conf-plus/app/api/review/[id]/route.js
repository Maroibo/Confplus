import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    const { searchParams }= new URL(request.url);
    const type = searchParams.get("type")?.toLowerCase();
    // const done = searchParams.get("done")?.toLowerCase();
    // if (done === "pending") {
    //   await repo.readPendingReviews(id, type);
    const response = await repo.readReview(id, type);
    if (response.done) {
      return NextResponse.json(response.review);
    } else {
      return NextResponse.json({
        error: "review not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function DELETE(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.deleteReview(id);
    if (response.done) {
      return NextResponse.json(response.review);
    } else {
      return NextResponse.json({
        error: "review not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
export async function PUT(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.updateReview(id, await request.json());
    if (response.done) {
      return NextResponse.json(response.review);
    } else {
      return NextResponse.json({
        error: "review not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

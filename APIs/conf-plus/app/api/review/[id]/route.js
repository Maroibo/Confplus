import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    const type = new URL(request.url).searchParams.get("type")?.toLowerCase();
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
export async function DELETE(request, { params }){
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

import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function POST(request) {
    try {
      const authorPaper = await request.json();
      const response = await repo.createAuthorPaper(authorPaper);

      if (response.done) {
        return NextResponse.json(response.authorPaper);
      } else {
        return NextResponse.json({
          error: "authorPaper not created",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request) {
    try {
      const response = await repo.readAllAcceptedPapers();
      if (response.done) {
        return NextResponse.json({papers_presenters: response.papers_presenters});
      } else {
        return NextResponse.json({
          error: "papers not found",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  
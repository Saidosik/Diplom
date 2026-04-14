import { NextResponse } from "next/server";
import { getLessonBySlug } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!lesson) {
    return NextResponse.json({ message: "Урок не найден." }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

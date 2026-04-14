import { NextRequest, NextResponse } from "next/server";
import { getLessons } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 4);
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const level = searchParams.get("level");
  const track = searchParams.get("track");

  await new Promise((resolve) => setTimeout(resolve, 600));

  const filtered = getLessons().filter((lesson) => {
    const matchesSearch =
      search.length === 0 ||
      lesson.title.toLowerCase().includes(search) ||
      lesson.excerpt.toLowerCase().includes(search) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(search));

    const matchesLevel = !level || lesson.level === level;
    const matchesTrack = !track || lesson.track === track;

    return matchesSearch && matchesLevel && matchesTrack;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return NextResponse.json({
    items,
    meta: {
      page: normalizedPage,
      pageSize,
      total,
      totalPages,
    },
  });
}

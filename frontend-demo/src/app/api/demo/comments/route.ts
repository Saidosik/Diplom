import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };

  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!body.message || body.message.trim().length < 3) {
    return NextResponse.json(
      { message: "Комментарий должен содержать минимум 3 символа." },
      { status: 422 }
    );
  }

  return NextResponse.json({
    id: Date.now(),
    author: "Server Echo",
    message: body.message.trim(),
    createdAt: new Date().toISOString(),
  });
}

import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { getAccessTokenCookie } from '@/lib/auth/cookies';
import createLaravelApi from '@/lib/http/laravel';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function readProxyBody(request: NextRequest): Promise<string | Buffer | undefined> {
  if (['GET', 'HEAD'].includes(request.method)) {
    return undefined;
  }

  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const buffer = await request.arrayBuffer();
    return Buffer.from(buffer);
  }

  return request.text();
}

async function proxyLaravel(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const token = await getAccessTokenCookie();
  const laravel = createLaravelApi(token);
  const endpoint = `/${path.join('/')}${request.nextUrl.search}`;
  const contentType = request.headers.get('content-type') ?? undefined;

  try {
    const body = await readProxyBody(request);

    const response = await laravel.request({
      url: endpoint,
      method: request.method,
      data: body,
      headers: {
        ...(contentType ? { 'Content-Type': contentType } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: 'Ошибка запроса к Laravel' },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: 'Внутренняя ошибка Next.js proxy' },
      { status: 500 },
    );
  }
}

export const GET = proxyLaravel;
export const POST = proxyLaravel;
export const PATCH = proxyLaravel;
export const PUT = proxyLaravel;
export const DELETE = proxyLaravel;

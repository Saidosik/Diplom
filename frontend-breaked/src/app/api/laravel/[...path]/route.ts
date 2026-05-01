//BFF слой, эндпоинт для отправки запроса в laravel, 
// это универсальный метод который читает принимает запрос, проксирует в бэкенд и возвращает ответ в браузер

import { getAccessTokenCookie } from "@/lib/auth/cookies";
import createLaravelApi from "@/lib/http/laravel";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server"

type RouteContext = {
    params: Promise<{path: string[]}>
}
//читаем тело запроса
async function readProxyBody(request: NextRequest): Promise<string | Buffer| undefined> {
    if(['GET', 'HEAD'].includes(request.method)){
        return undefined;
    }

    const contentType = request.headers.get('content-type')?? ''
    if(contentType.includes('multipart/form-data')){
        const buffer = await request.arrayBuffer();
        return Buffer.from(buffer)
    }
    return request.text()
}

// запрос в ларавель
async function proxyLaravel(request: NextRequest, context: RouteContext) {
    const {path} = await context.params;
    const token = await getAccessTokenCookie()
    const Laravel = createLaravelApi(token)
    const endpoint = `${path.join('/')}${request.nextUrl.search}`
    const contentType = request.headers.get('content-type')?? undefined;

    try{
        const body = readProxyBody(request)

        const response = await Laravel.request({
            url: endpoint,
            method: request.method,
            data: body,
            headers:{
                ...(contentType ?{ 'Content-Type': contentType}: {}),
            }
        })

        return NextResponse.json(response.data, {status: response.status})
    }catch(error){
        if(isAxiosError(error)){
            return NextResponse.json(
                error.response?.data ?? {message: 'Ошибка запроса к серверу'},
                {status: error.response?.status ?? 500}
            )
        }

        return NextResponse.json(
            {message: 'Ошибка проксироания запроса к серверу'},
            {status: 500}
        )
    }
}

//Описываем какие функции за какие HTTP методы отвечают 

export const GET = proxyLaravel
export const POST = proxyLaravel
export const PATCH = proxyLaravel
export const PUT = proxyLaravel
export const DELETE = proxyLaravel

import { NextResponse } from 'next/server';

export function buildErrorResponse(
  message: string,
  statusCode: number,
  traceId?: string,
  path?: string
) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      meta: {},
      status: {
        code: statusCode,
        message,
      },
      timestamp: new Date().toISOString(),
      traceId: traceId ?? '',
      path: path ?? '',
    },
    { status: statusCode }
  );
}

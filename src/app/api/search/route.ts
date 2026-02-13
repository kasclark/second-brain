import { NextResponse } from 'next/server'
import { searchContent } from '@/lib/files'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  return NextResponse.json(searchContent(q))
}

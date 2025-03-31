// utils/helpers/getClientIp.ts
import { headers } from 'next/headers'
import requestIp from 'request-ip'

export function getClientIp(): string {
  const headersList = headers()

  const req = {
    headers: {
      'x-forwarded-for': headersList.get('x-forwarded-for') || '',
      'x-real-ip': headersList.get('x-real-ip') || '',
      'cf-connecting-ip': headersList.get('cf-connecting-ip') || '',
    },
    connection: {
      remoteAddress: headersList.get('x-real-ip') || '',
    },
  } as any

  const ip = requestIp.getClientIp(req) || '8.8.8.8'
  return ip
}

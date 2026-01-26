const faviconBase64 =
  'AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAA==';

export function GET() {
  const buffer = Buffer.from(faviconBase64, 'base64');
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}

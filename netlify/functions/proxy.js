export default async (request, context) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const params = url.searchParams;

  const endpoint = params.get('endpoint') || 'observations';
  params.delete('endpoint');

  const upstreamPath = endpoint === 'forecasts'
    ? 'https://wethr.net/api/v2/forecasts.php'
    : 'https://wethr.net/api/v2/observations.php';

  const upstream = upstreamPath + '?' + params.toString();

  const response = await fetch(upstream, {
    headers: {
      'Authorization': 'Bearer ' + Deno.env.get('WETHR_API_KEY'),
      'Content-Type': 'application/json',
    },
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const config = {
  path: '/api/proxy',
};

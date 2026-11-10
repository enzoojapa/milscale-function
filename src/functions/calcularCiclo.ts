import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { handleCalcularCiclo } from '../application/handlers';

export async function calcularCicloHttp(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const corpo = req.method === 'POST' ? ((await req.json().catch(() => ({}))) as Record<string, unknown>) : {};
  const entrada = {
    efetivoApto: corpo.efetivoApto ?? req.query.get('efetivoApto'),
    necessidadeDiaria: corpo.necessidadeDiaria ?? req.query.get('necessidadeDiaria'),
  };
  const r = handleCalcularCiclo(entrada);
  context.log(`calcular-ciclo ${JSON.stringify(entrada)} -> ${r.status}`);
  return { status: r.status, jsonBody: r.corpo };
}

app.http('calcular-ciclo', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'ciclo',
  handler: calcularCicloHttp,
});

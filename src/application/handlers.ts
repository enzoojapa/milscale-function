import { calcularCiclo, CicloInvalidoError, ResultadoCiclo } from '../domain/Ciclo';
import { EventoEscala, montarNotificacoes, Notificacao } from '../domain/Notificacao';

export type RespostaCiclo = { status: 200; corpo: ResultadoCiclo } | { status: 400; corpo: { erro: string } };

export function handleCalcularCiclo(entrada: { efetivoApto?: unknown; necessidadeDiaria?: unknown }): RespostaCiclo {
  try {
    const resultado = calcularCiclo(Number(entrada.efetivoApto), Number(entrada.necessidadeDiaria ?? 1));
    return { status: 200, corpo: resultado };
  } catch (e) {
    if (e instanceof CicloInvalidoError) return { status: 400, corpo: { erro: e.message } };
    throw e;
  }
}

export interface Notificador {
  enviar(n: Notificacao): Promise<void>;
}

export async function handleEventoEscala(evento: EventoEscala, notificador: Notificador): Promise<number> {
  const notificacoes = montarNotificacoes(evento);
  for (const n of notificacoes) {
    await notificador.enviar(n);
  }
  return notificacoes.length;
}

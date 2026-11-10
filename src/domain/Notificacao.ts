export interface EventoEscala {
  tipo: string;
  versao: number;
  ocorridoEm: string;
  dados: Record<string, unknown>;
}

export interface Notificacao {
  destinatarioId: string;
  mensagem: string;
}

function dataBr(iso: unknown): string {
  const [a, m, d] = String(iso).split('-');
  return `${d}/${m}/${a}`;
}

/** Traduz um evento de dominio nas notificacoes que precisam ser enviadas aos militares. */
export function montarNotificacoes(evento: EventoEscala): Notificacao[] {
  const d = evento.dados;
  switch (evento.tipo) {
    case 'EscalaPublicada':
      return [
        {
          destinatarioId: String(d.militarId),
          mensagem: `${d.militarNome}, voce esta escalado de ${d.posto} em ${dataBr(d.data)}, das 08h00 as 08h00 do dia seguinte.`,
        },
      ];
    case 'TrocaAprovada':
      return [
        { destinatarioId: String(d.militarSaiId), mensagem: `Sua troca do servico de ${dataBr(d.data)} foi aprovada. Voce esta dispensado.` },
        { destinatarioId: String(d.militarEntraId), mensagem: `${d.militarEntraNome}, voce assumiu o servico de ${dataBr(d.data)}.` },
      ];
    default:
      return [];
  }
}

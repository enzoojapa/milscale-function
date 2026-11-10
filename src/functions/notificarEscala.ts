import { app, InvocationContext } from '@azure/functions';
import { handleEventoEscala } from '../application/handlers';
import { EventoEscala } from '../domain/Notificacao';

export async function notificarEscala(mensagem: unknown, context: InvocationContext): Promise<void> {
  const evento = (typeof mensagem === 'string' ? JSON.parse(mensagem) : mensagem) as EventoEscala;
  context.log(`[evento recebido] ${evento.tipo} v${evento.versao} em ${evento.ocorridoEm}`);
  const total = await handleEventoEscala(evento, {
    enviar: async (n) => context.log(`[notificacao] para ${n.destinatarioId}: ${n.mensagem}`),
  });
  context.log(`[evento processado] ${evento.tipo}: ${total} notificacao(oes) enviada(s)`);
}

app.serviceBusQueue('notificar-escala', {
  connection: 'ServiceBusConnection',
  queueName: '%SERVICEBUS_QUEUE%',
  handler: notificarEscala,
});

import { handleCalcularCiclo, handleEventoEscala } from '../../src/application/handlers';
import { calcularCiclo, CicloInvalidoError } from '../../src/domain/Ciclo';
import { montarNotificacoes } from '../../src/domain/Notificacao';

describe('Ciclo dinamico', () => {
  it('24 aptos para 4 postos gera ciclo de 6 dias', () => {
    const r = calcularCiclo(24, 4);
    expect(r.cicloDias).toBe(6);
    expect(r.folgaEntreServicosDias).toBe(5);
    expect(r.servicosPorMilitarEm30Dias).toBe(5);
  });

  it('arredonda para baixo e informa a sobra', () => {
    const r = calcularCiclo(26, 4);
    expect(r.cicloDias).toBe(6);
    expect(r.sobra).toBe(2);
  });

  it('recusa efetivo menor que a necessidade diaria', () => {
    expect(() => calcularCiclo(3, 4)).toThrow(CicloInvalidoError);
  });

  it('handler HTTP devolve 400 para entrada invalida', () => {
    expect(handleCalcularCiclo({ efetivoApto: 'abc', necessidadeDiaria: 4 }).status).toBe(400);
    expect(handleCalcularCiclo({ efetivoApto: '24', necessidadeDiaria: '4' }).status).toBe(200);
  });
});

describe('Consumo de eventos', () => {
  const publicada = {
    tipo: 'EscalaPublicada',
    versao: 1,
    ocorridoEm: '2026-11-10T12:00:00Z',
    dados: { escalaId: 1, data: '2026-11-20', posto: 'SENTINELA', militarId: 'm1', militarNome: 'SD SILVA' },
  };

  it('EscalaPublicada gera uma notificacao para o militar escalado', () => {
    const n = montarNotificacoes(publicada);
    expect(n).toHaveLength(1);
    expect(n[0].mensagem).toContain('20/11/2026');
  });

  it('TrocaAprovada avisa quem sai e quem entra', async () => {
    const enviadas: string[] = [];
    const total = await handleEventoEscala(
      { ...publicada, tipo: 'TrocaAprovada', dados: { data: '2026-11-20', militarSaiId: 'm1', militarEntraId: 'm2', militarEntraNome: 'SD SOUZA' } },
      { enviar: async (x) => void enviadas.push(x.destinatarioId) },
    );
    expect(total).toBe(2);
    expect(enviadas).toEqual(['m1', 'm2']);
  });

  it('evento desconhecido nao gera notificacao', () => {
    expect(montarNotificacoes({ ...publicada, tipo: 'Outro' })).toEqual([]);
  });
});

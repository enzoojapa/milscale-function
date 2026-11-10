export class CicloInvalidoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CicloInvalidoError';
  }
}

export interface ResultadoCiclo {
  efetivoApto: number;
  necessidadeDiaria: number;
  cicloDias: number;
  folgaEntreServicosDias: number;
  servicosPorMilitarEm30Dias: number;
  sobra: number;
}

/**
 * Ciclo dinamico do MilScale: cada militar tira servico a cada N dias, onde
 * N = efetivo apto / necessidade diaria (arredondado para baixo).
 */
export function calcularCiclo(efetivoApto: number, necessidadeDiaria: number): ResultadoCiclo {
  if (!Number.isInteger(efetivoApto) || efetivoApto < 0) {
    throw new CicloInvalidoError('efetivoApto deve ser um inteiro maior ou igual a zero');
  }
  if (!Number.isInteger(necessidadeDiaria) || necessidadeDiaria <= 0) {
    throw new CicloInvalidoError('necessidadeDiaria deve ser um inteiro maior que zero');
  }
  if (efetivoApto < necessidadeDiaria) {
    throw new CicloInvalidoError(
      `Efetivo insuficiente: ${efetivoApto} aptos para ${necessidadeDiaria} postos por dia`,
    );
  }
  const cicloDias = Math.floor(efetivoApto / necessidadeDiaria);
  return {
    efetivoApto,
    necessidadeDiaria,
    cicloDias,
    folgaEntreServicosDias: cicloDias - 1,
    servicosPorMilitarEm30Dias: Math.ceil(30 / cicloDias),
    sobra: efetivoApto % necessidadeDiaria,
  };
}

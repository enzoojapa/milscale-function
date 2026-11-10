# MilScale - Azure Function

Funções serverless do MilScale:

| Função | Gatilho | Descrição |
|---|---|---|
| calcular-ciclo | HTTP (`GET/POST /api/ciclo`) | Calcula o ciclo de serviço: efetivo apto ÷ necessidade diária de postos |
| notificar-escala | Service Bus (fila `escala-eventos`) | Consome `EscalaPublicada` e `TrocaAprovada` e gera as notificações para os militares |
| health | HTTP (`GET /api/health`) | Status |

Exemplo: `GET /api/ciclo?efetivoApto=24&necessidadeDiaria=4` retorna ciclo de 6 dias (5 de folga entre serviços).

## Arquitetura

```
Usuário -> Microfrontend (React) -> API Gateway (AWS) -> BFF (Node.js)
                                                         |-> Efetivo Service -> MongoDB Atlas
                                                         |-> Escala Service  -> Azure SQL
                                                         |                   -> Azure Service Bus -> Function (notificar-escala)
                                                         |-> Azure Function (calcular-ciclo)
```

```
src/
  domain/        cálculo do ciclo e montagem das notificações (sem dependência do Azure)
  application/   handlers usados pelos gatilhos
  functions/     um gatilho por arquivo (modelo de programação v4)
tests/
  unit/          ciclo, notificações e handlers
  architecture/  domain e application não dependem do SDK @azure/functions
```

## Tecnologias

Azure Functions v4 (Node.js 22), TypeScript, Azure Service Bus, Jest.

## Como rodar localmente

```bash
npm install
cp local.settings.example.json local.settings.json   # ServiceBusConnection
npm run build
func start      # requer Azure Functions Core Tools
npm test
```

## Links

- Function: _LINK_FUNCTION_

## Projetos do sistema

| Componente | Repositório |
|---|---|
| Microfrontend (React) | [milscale-frontend](https://github.com/enzoojapa/milscale-frontend) |
| BFF (Node.js) | [milscale-bff](https://github.com/enzoojapa/milscale-bff) |
| Microsserviço de efetivo (MongoDB) | [milscale-efetivo-service](https://github.com/enzoojapa/milscale-efetivo-service) |
| Microsserviço de escalas (Azure SQL) | [milscale-escala-service](https://github.com/enzoojapa/milscale-escala-service) |
| Azure Function | [milscale-function](https://github.com/enzoojapa/milscale-function) |

## Alunos

- Enzo Watanabe de Lima
- João Guilherme Salomão
- João Guilherme Cordeiro
- Rafael Zeni Simião

PUCPR - Engenharia de Software - Arquitetura e Soluções Cloud (2026/2)

# MilScale - Azure Function

Aqui ficam as funções serverless do MilScale, que rodam no Azure Functions.

A `calcular-ciclo` tem gatilho HTTP e calcula o ciclo de serviço, que é o efetivo apto dividido pela quantidade de postos por dia. Por exemplo, `GET /api/ciclo?efetivoApto=24&necessidadeDiaria=4` devolve um ciclo de 6 dias, ou seja, 5 dias de folga entre um serviço e outro. Se tiver menos gente apta do que postos, ela avisa que o efetivo é insuficiente. Quem chama essa função é o BFF, na montagem do painel.

A `notificar-escala` tem gatilho de mensagem e fica escutando a fila `escala-eventos` do Azure Service Bus. Toda vez que o serviço de escalas publica uma escala ou aprova uma troca, chega uma mensagem e ela gera a notificação pros militares envolvidos. Também tem uma `health` só pra checar se está no ar.

A regra do ciclo e a montagem das notificações ficam em `src/domain`, sem nada do Azure. Em `src/application` ficam os handlers e em `src/functions` cada gatilho em um arquivo, no modelo de programação v4. Os testes unitários cobrem o cálculo e as notificações, e o teste de arquitetura garante que o domínio e a aplicação não dependem do SDK do Azure Functions.

Foi feito em Node.js 22 com TypeScript, Azure Functions v4, Service Bus e Jest.

Pra rodar localmente precisa do Azure Functions Core Tools e da connection string do Service Bus no `local.settings.json`:

```bash
npm install
cp local.settings.example.json local.settings.json
npm run build
func start
npm test
```

A função publicada pode ser testada em https://func-milscale-enzo.azurewebsites.net/api/ciclo?efetivoApto=24&necessidadeDiaria=4. Os outros repositórios do projeto são o frontend (https://github.com/enzoojapa/milscale-frontend), o BFF (https://github.com/enzoojapa/milscale-bff), o serviço de efetivo (https://github.com/enzoojapa/milscale-efetivo-service) e o serviço de escalas (https://github.com/enzoojapa/milscale-escala-service).

Trabalho feito por Enzo Watanabe de Lima, João Guilherme Salomão, João Guilherme Cordeiro e Rafael Zeni Simião, para a disciplina de Arquitetura e Soluções Cloud da PUCPR (2026/2).

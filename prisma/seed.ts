import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const BCRYPT_COST = 10;

type LessonSeed = {
  title: string;
  body: string;
  sortOrder: number;
  durationMinutes: number;
  videoUrl?: string;
};

type CourseSeed = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  workloadHours: number;
  isFree: boolean;
  priceLabel: string;
  isAccessible: boolean;
  targetAudience: string;
  maxSeats: number;
  listedSeatsRemaining: number;
  isDemo?: boolean;
  lessons: LessonSeed[];
};

const courses: CourseSeed[] = [
  {
    slug: "primeiros-passos-empreender",
    title: "Primeiros passos para empreender",
    summary:
      "Do insight ao primeiro cliente: organize sua ideia, valide a necessidade e divulgue com o que você já tem.",
    description:
      "Curso demonstração do Capacíta+ para quem quer começar um pequeno negócio com clareza e baixo custo. Você vai delimitar a ideia, entender o cliente e praticar um primeiro preço com divulgação simples — sem jargão e com exemplos do cotidiano.",
    workloadHours: 2,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Pessoas que desejam empreender pela primeira vez",
    maxSeats: 40,
    listedSeatsRemaining: 40,
    isDemo: true,
    lessons: [
      {
        title: "Ideia e cliente",
        sortOrder: 1,
        durationMinutes: 45,
        body: `## O que você leva desta aula

Antes de gastar dinheiro, você precisa responder duas perguntas: **o que você oferece** e **para quem isso resolve um problema real**.

## Delimite a ideia

Escreva em uma frase: *eu ajudo [quem] a [resultado] por meio de [produto ou serviço]*.

Exemplos:

- Eu ajudo vizinhas a terem marmitas saudáveis na semana por meio de encomendas semanais.
- Eu ajudo pequenos comércios a organizarem o estoque por meio de planilhas simples.

## Conheça o cliente

Converse com 5 pessoas do seu círculo. Pergunte:

1. Como você resolve isso hoje?
2. O que mais incomoda nesse jeito atual?
3. Quanto você já gasta (tempo ou dinheiro) com isso?

Anote as respostas. O padrão que se repetir é o seu ponto de partida.

## Exercício

Complete o quadro: ideia em uma frase, três dores ouvidas e uma promessa que você consegue cumprir na próxima semana.`,
      },
      {
        title: "Primeiro preço e divulgação",
        sortOrder: 2,
        durationMinutes: 50,
        body: `## Preço que cabe na realidade

Some: custo dos materiais + o valor da sua hora + uma margem pequena para imprevisto. Esse é o **piso**. O preço anunciado precisa ficar acima dele.

Se ainda não souber sua hora, comece com um valor honesto pelo tempo que a tarefa leva e ajuste depois das primeiras vendas.

## Divulgação com o que você já tem

Você não precisa de site no primeiro dia. Use:

- WhatsApp e status com foto nítida do produto ou do resultado
- Uma frase clara: o que é, para quem é e como pedir
- Pedido de indicação para quem já gostou

## Mini plano de 7 dias

1. Definir oferta e preço
2. Tirar 3 fotos simples
3. Avisar 20 pessoas
4. Anotar pedidos e recusas
5. Ajustar a mensagem

## Encerramento

Quando terminar esta aula, você poderá emitir o certificado do curso demonstração. Leve o plano de 7 dias para a prática.`,
      },
    ],
  },
  {
    slug: "informatica-basica",
    title: "Informática básica",
    summary:
      "E-mail, arquivos, navegação segura e ferramentas do dia a dia para o trabalho e o MEI.",
    description:
      "Aprenda o essencial para usar o computador e o celular com confiança: criar e organizar arquivos, enviar e-mails profissionais, pesquisar com segurança e evitar golpes comuns. Conteúdo acessível, com passos curtos e linguagem simples.",
    workloadHours: 8,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Iniciantes no uso de computador e celular para o trabalho",
    maxSeats: 50,
    listedSeatsRemaining: 50,
    lessons: [
      {
        title: "Organizar arquivos e pastas",
        sortOrder: 1,
        durationMinutes: 40,
        body: `## Por que organizar

Arquivo perdido é tempo perdido — e, no MEI, pode ser nota fiscal ou comprovante.

## Prática

Crie pastas por ano e por tema: **Clientes**, **Notas**, **Curriculo**. Use nomes curtos e datas no formato \`2026-03-orcamento-maria.pdf\`.

## Dica de acessibilidade

Aumente o zoom do sistema e ative o leitor de tela se precisar. O importante é você encontrar o arquivo sem depender da memória.`,
      },
      {
        title: "E-mail profissional",
        sortOrder: 2,
        durationMinutes: 45,
        body: `## Estrutura de um e-mail claro

Assunto objetivo, saudação, pedido em um parágrafo e assinatura com nome e telefone.

Evite CAPS LOCK e anexe só o necessário. Confira o destinatário antes de enviar.

## Exercício

Escreva um e-mail pedindo orçamento e outro enviando um currículo.`,
      },
      {
        title: "Navegação segura",
        sortOrder: 3,
        durationMinutes: 35,
        body: `## Sinais de golpe

Link encurtado suspeito, urgência extrema, pedido de senha ou PIX. Em dúvida, não clique.

Prefira sites com cadeado, senhas longas e autenticação em dois fatores no e-mail.`,
      },
    ],
  },
  {
    slug: "mei-na-pratica",
    title: "MEI na prática",
    summary:
      "Entenda o que é o MEI, quando vale a pena formalizar e quais obrigações cabem no dia a dia.",
    description:
      "Um panorama objetivo do Microempreendedor Individual: enquadramento, ocupações permitidas, DAS, nota fiscal e cuidados para não perder o desenquadramento. Feito para quem está formalizando ou pensando em formalizar.",
    workloadHours: 6,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Quem presta serviço ou vende e quer se formalizar",
    maxSeats: 45,
    listedSeatsRemaining: 45,
    lessons: [
      {
        title: "O que é o MEI",
        sortOrder: 1,
        durationMinutes: 40,
        body: `## Formalizar para crescer com proteção

O MEI é um desenho simplificado de empresa para quem fatura até o limite legal vigente e exerce ocupação permitida.

Você passa a ter CNPJ, acesso a benefícios previdenciários e mais facilidade para emitir nota e vender para outras empresas.`,
      },
      {
        title: "DAS e obrigações mensais",
        sortOrder: 2,
        durationMinutes: 40,
        body: `## O boleto que não pode atrasar

O DAS é o pagamento mensal unificado. Guarde o comprovante. Atrasos geram juros e podem afetar benefícios.

Faça um lembrete fixo no celular no mesmo dia de todo mês.`,
      },
      {
        title: "Nota fiscal sem pânico",
        sortOrder: 3,
        durationMinutes: 35,
        body: `## Quando emitir

Quando o cliente pessoa jurídica pedir, ou quando a prefeitura exigir. Treine com uma nota de teste e um checklist: serviço, valor, tomador e descrição clara.`,
      },
    ],
  },
  {
    slug: "financas-pessoais",
    title: "Finanças pessoais",
    summary:
      "Organize ganhos, gastos e uma reserva mínima para decidir com menos aperto.",
    description:
      "Ferramentas simples para registrar entradas e saídas, separar conta pessoal da conta do negócio e criar uma reserva de emergência mesmo com renda variável. Sem planilha complicada: o foco é hábito.",
    workloadHours: 5,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Trabalhadores e empreendedores com renda variável",
    maxSeats: 60,
    listedSeatsRemaining: 60,
    lessons: [
      {
        title: "Mapear o dinheiro",
        sortOrder: 1,
        durationMinutes: 35,
        body: `## O retrato da semana

Anote 7 dias de entradas e saídas. Classifique em: casa, comida, transporte, negócio e outros.

O número não julga. Ele mostra por onde começar.`,
      },
      {
        title: "Reserva mínima",
        sortOrder: 2,
        durationMinutes: 30,
        body: `## Um envelope, um objetivo

Defina um valor pequeno e automático. Renda variável pede percentual, não valor fixo: 5% de cada entrada já cria ritmo.`,
      },
      {
        title: "Pessoal e negócio separados",
        sortOrder: 3,
        durationMinutes: 30,
        body: `## Dois bolsos

Mesmo sem duas contas no banco, registre o que é da casa e o que é do negócio. Preço e pró-labore ficam mais honestos.`,
      },
    ],
  },
  {
    slug: "comunicacao-para-entrevistas",
    title: "Comunicação para entrevistas",
    summary:
      "Monte respostas claras, apresente sua experiência e pratique uma conversa de seleção.",
    description:
      "Curso curto e prático para quem vai a uma entrevista de emprego ou conversa com cliente. Você estrutura o que dizer, treina exemplos e aprende a falar de lacunas no currículo com honestidade. Turma reduzida para acompanhar melhor cada pessoa.",
    workloadHours: 4,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Quem busca recolocação ou primeira oportunidade",
    maxSeats: 3,
    listedSeatsRemaining: 3,
    lessons: [
      {
        title: "Conte a sua história",
        sortOrder: 1,
        durationMinutes: 35,
        body: `## Um minuto sobre você

Presente, passado útil e futuro próximo. Evite biografia longa. Termine com o que você quer fazer nesta vaga.`,
      },
      {
        title: "Método STAR em respostas",
        sortOrder: 2,
        durationMinutes: 40,
        body: `## Situação, Tarefa, Ação, Resultado

Prepare 3 histórias: um problema resolvido, um aprendizado e um trabalho em equipe. Números ajudam, mesmo que pequenos.`,
      },
      {
        title: "Perguntas que você pode fazer",
        sortOrder: 3,
        durationMinutes: 25,
        body: `## Entrevista é via de mão dupla

Pergunte sobre o dia a dia, o time e o que define sucesso nos primeiros 90 dias. Isso demonstra interesse real.`,
      },
    ],
  },
  {
    slug: "agricultura-familiar-introdutoria",
    title: "Agricultura familiar introdutória",
    summary:
      "Boas práticas de produção de pequeno porte, comercialização local e organização da propriedade.",
    description:
      "Introdução à agricultura familiar com foco em planejamento simples, segurança no manejo, registro de custos e venda em feiras e cestas. Linguagem acessível para quem já planta ou está começando um quintal produtivo.",
    workloadHours: 7,
    isFree: true,
    priceLabel: "Gratuito",
    isAccessible: true,
    targetAudience: "Famílias rurais e quem inicia um quintal produtivo",
    maxSeats: 35,
    listedSeatsRemaining: 35,
    lessons: [
      {
        title: "Planejar o quintal e a safra curta",
        sortOrder: 1,
        durationMinutes: 40,
        body: `## O que cabe na sua terra e no seu tempo

Comece pelo que a família já consome e pelo que a feira da região pede. Um canteiro bem cuidado vale mais que dez abandonados.`,
      },
      {
        title: "Custos e preço justo",
        sortOrder: 2,
        durationMinutes: 35,
        body: `## Sem adivinhar o preço

Some semente, adubo, transporte e horas. O preço da feira precisa cobrir isso e ainda sobrar para a casa.`,
      },
      {
        title: "Vender perto de casa",
        sortOrder: 3,
        durationMinutes: 35,
        body: `## Feira, cesta e encomenda

Combine dia, quantidade e forma de pagamento. Foto boa e pontualidade constroem confiança mais rápido que desconto.`,
      },
    ],
  },
  {
    slug: "gestao-avancada-de-negocios",
    title: "Gestão avançada de negócios",
    summary:
      "Indicadores, fluxo de caixa e rotina de gestão para quem já fatura e quer organizar o crescimento.",
    description:
      "Trilha paga para empreendedores que já passaram da ideia inicial. Você monta um painel simples de indicadores, aprende a ler o caixa da semana e define rituais de gestão sem precisar de software caro. Curso demonstrativo de oferta paga no catálogo.",
    workloadHours: 10,
    isFree: false,
    priceLabel: "R$ 89",
    isAccessible: true,
    targetAudience: "MEI e pequenos negócios com operação em andamento",
    maxSeats: 25,
    listedSeatsRemaining: 25,
    lessons: [
      {
        title: "Números que cabem numa folha",
        sortOrder: 1,
        durationMinutes: 45,
        body: `## Três indicadores

Faturamento da semana, ticket médio e despesas fixas. Se você acompanha só isso com disciplina, já decide melhor que a intuição sozinha.`,
      },
      {
        title: "Fluxo de caixa semanal",
        sortOrder: 2,
        durationMinutes: 45,
        body: `## Entrar, sair, sobrar

Projete 4 semanas. Marque vencimentos. O objetivo é ver o aperto antes dele chegar.`,
      },
      {
        title: "Rituais de gestão",
        sortOrder: 3,
        durationMinutes: 40,
        body: `## 30 minutos na segunda

Reveja números, uma pendência de cliente e uma melhoria operacional. Gestão é rotina, não evento.`,
      },
    ],
  },
];

async function executeSeed(): Promise<void> {
  await prisma.courseReview.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  const anaPasswordHash = await bcrypt.hash("Demo@12345", BCRYPT_COST);
  const adminPasswordHash = await bcrypt.hash("Admin@12345", BCRYPT_COST);
  const ana = await prisma.user.create({
    data: {
      name: "Ana Demo",
      email: "ana.demo@capacita.local",
      passwordHash: anaPasswordHash,
      role: "ALUNO",
      isPwd: false,
    },
  });
  const admin = await prisma.user.create({
    data: {
      name: "Admin Capacíta+",
      email: "admin@capacita.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isPwd: false,
    },
  });
  void ana;
  const createdCourses = [];
  for (const course of courses) {
    const created = await prisma.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        summary: course.summary,
        description: course.description,
        workloadHours: course.workloadHours,
        isFree: course.isFree,
        priceLabel: course.priceLabel,
        isAccessible: course.isAccessible,
        targetAudience: course.targetAudience,
        maxSeats: course.maxSeats,
        listedSeatsRemaining: course.listedSeatsRemaining,
        isDemo: course.isDemo ?? false,
        lessons: {
          create: course.lessons.map((lesson) => ({
            title: lesson.title,
            body: lesson.body,
            sortOrder: lesson.sortOrder,
            durationMinutes: lesson.durationMinutes,
            videoUrl: lesson.videoUrl,
          })),
        },
      },
    });
    createdCourses.push(created);
  }
  const interviewCourse = createdCourses.find(
    (course) => course.slug === "comunicacao-para-entrevistas",
  );
  if (interviewCourse) {
    await prisma.enrollment.create({
      data: {
        userId: admin.id,
        courseId: interviewCourse.id,
      },
    });
  }
}

executeSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

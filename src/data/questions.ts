export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  tooltip?: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: "perfil",
    title: "Em qual perfil você se enquadra?",
    subtitle: "Selecione a opção que melhor descreve sua situação atual.",
    tooltip: "Essa informação ajuda a direcionar a análise para o seu caso específico.",
    options: [
      { id: "gestante_primeiro", label: "Gestante do meu 1º Filho(a)", description: "Primeira gestação registrada" },
      { id: "gestante_outro", label: "Gestante, mas NÃO é meu 1º Filho(a)", description: "Já possui filhos anteriores" },
      { id: "mae_nao_gestante", label: "Sou Mãe, mas não estou Gestante", description: "Mãe com filhos nascidos" },
      { id: "mae_adotiva", label: "Sou Mãe Adotiva", description: "Processo de adoção legal" },
      { id: "mae_natimorto", label: "Sou Mãe de Natimorto", description: "Gestação com perda fetal" },
    ],
  },
  {
    id: "trabalho",
    title: "Qual é a sua situação profissional atual?",
    subtitle: "Informe como você está vinculada profissionalmente.",
    tooltip: "O tipo de vínculo profissional determina a forma de concessão do benefício pelo INSS.",
    options: [
      { id: "clt", label: "Trabalho com Carteira Assinada (CLT)", description: "Vínculo formal regido pela CLT" },
      { id: "autonoma", label: "Sou Autônoma / Contribuinte Individual", description: "Contribui por conta própria ao INSS" },
      { id: "mei", label: "Sou MEI (Microempreendedora Individual)", description: "Cadastrada como MEI ativo" },
      { id: "desempregada", label: "Estou Desempregada", description: "Sem vínculo empregatício atual" },
      { id: "domestica", label: "Sou Empregada Doméstica", description: "Trabalho doméstico com registro" },
    ],
  },
  {
    id: "contribuicao",
    title: "Você contribuiu para o INSS nos últimos 12 meses?",
    subtitle: "Considere contribuições como empregada, autônoma ou facultativa.",
    tooltip: "A carência mínima para o salário-maternidade varia conforme o tipo de segurada. Em geral, são necessárias 10 contribuições mensais.",
    options: [
      { id: "sim_regular", label: "Sim, contribuí regularmente", description: "Sem interrupções nos pagamentos" },
      { id: "sim_irregular", label: "Sim, mas com algumas falhas", description: "Houve meses sem contribuição" },
      { id: "nao", label: "Não contribuí", description: "Nenhuma contribuição recente" },
      { id: "nao_sei", label: "Não tenho certeza", description: "Preciso verificar meu extrato CNIS" },
    ],
  },
  {
    id: "tempo_contribuicao",
    title: "Por quanto tempo você já contribuiu ao INSS no total?",
    subtitle: "Some todos os períodos de contribuição, mesmo que não consecutivos.",
    tooltip: "O tempo total de contribuição pode garantir a qualidade de segurada mesmo em períodos de graça.",
    options: [
      { id: "menos_10", label: "Menos de 10 meses", description: "Período curto de contribuição" },
      { id: "10_a_24", label: "De 10 meses a 2 anos", description: "Período intermediário" },
      { id: "2_a_5", label: "De 2 a 5 anos", description: "Contribuição consistente" },
      { id: "mais_5", label: "Mais de 5 anos", description: "Longo período contributivo" },
    ],
  },
  {
    id: "situacao_gestacao",
    title: "Qual é o estágio atual da sua gestação ou situação?",
    subtitle: "Informe em que momento você se encontra.",
    tooltip: "O momento da solicitação pode influenciar os prazos e valores do benefício.",
    options: [
      { id: "inicio", label: "Início da gestação (1º trimestre)", description: "Até 12 semanas de gestação" },
      { id: "meio", label: "Meio da gestação (2º trimestre)", description: "Entre 13 e 27 semanas" },
      { id: "final", label: "Final da gestação (3º trimestre)", description: "A partir de 28 semanas" },
      { id: "ja_nasceu", label: "O bebê já nasceu", description: "Parto já realizado" },
      { id: "adocao", label: "Processo de adoção em andamento", description: "Guarda judicial para fins de adoção" },
    ],
  },
  {
    id: "renda",
    title: "Qual é a sua faixa de renda mensal?",
    subtitle: "Essa informação ajuda a estimar o valor do benefício.",
    tooltip: "O valor do salário-maternidade para seguradas CLT corresponde à remuneração integral. Para demais categorias, é calculado com base nas contribuições.",
    options: [
      { id: "ate_1_salario", label: "Até 1 salário mínimo", description: "R$ 1.412,00 em 2024" },
      { id: "1_a_3", label: "De 1 a 3 salários mínimos", description: "R$ 1.412 a R$ 4.236" },
      { id: "3_a_5", label: "De 3 a 5 salários mínimos", description: "R$ 4.236 a R$ 7.060" },
      { id: "acima_5", label: "Acima de 5 salários mínimos", description: "Acima de R$ 7.060" },
    ],
  },
  {
    id: "contato",
    title: "Como você prefere receber o resultado da sua análise?",
    subtitle: "Escolha a forma mais conveniente para você.",
    tooltip: "Seus dados são tratados com total sigilo e usados apenas para esta análise.",
    options: [
      { id: "whatsapp", label: "WhatsApp", description: "Receba pelo WhatsApp" },
      { id: "email", label: "E-mail", description: "Receba por e-mail" },
      { id: "tela", label: "Ver resultado na tela", description: "Visualize agora mesmo" },
    ],
  },
];

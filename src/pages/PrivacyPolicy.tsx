import LegalLayout from "@/components/LegalLayout";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section><h2 className="mb-3 font-serif text-xl font-semibold text-foreground">{title}</h2><div className="space-y-3">{children}</div></section>
);

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade" subtitle="Transparência sobre como tratamos dados pessoais e protegemos sua privacidade.">
      <Section title="1. Quem somos"><p>A P&J Prev, CNPJ 38.381.395/0001-92, com atuação em Recife–PE e atendimento em todo o Brasil, é responsável por este site e pelos canais de atendimento associados.</p></Section>
      <Section title="2. Dados que podem ser tratados"><p>Podemos tratar dados fornecidos voluntariamente, como nome, telefone, e-mail e informações necessárias à análise inicial. Também podem ser coletados dados técnicos mínimos, como dispositivo, página acessada, origem da visita e parâmetros UTM.</p><p>As respostas do formulário são processadas pelo Respondi. O site utiliza Supabase para eventos operacionais e poderá utilizar WhatsApp e serviços de métricas quando estiverem configurados e autorizados.</p></Section>
      <Section title="3. Finalidades"><p>Os dados podem ser usados para realizar análise inicial, responder solicitações, entrar em contato, melhorar a experiência, medir o desempenho do site, proteger os canais e cumprir obrigações legais ou regulatórias.</p></Section>
      <Section title="4. Bases legais"><p>O tratamento poderá ocorrer mediante consentimento, para procedimentos preliminares solicitados pela titular, para cumprimento de obrigação legal e, quando aplicável, com base em legítimo interesse após avaliação dos direitos e expectativas da titular.</p></Section>
      <Section title="5. Cookies e métricas"><p>Recursos essenciais podem funcionar sem consentimento. Métricas opcionais, como Google Analytics, Google Ads, Google Tag Manager e Meta Pixel, somente serão carregadas após a escolha “Aceitar métricas”. A preferência pode ser alterada pelo link “Preferências de cookies” no rodapé.</p></Section>
      <Section title="6. Compartilhamento e operadores"><p>Dados poderão ser compartilhados apenas com prestadores necessários à operação, como hospedagem, formulário, banco de dados, mensageria e métricas. Esses terceiros tratam dados conforme suas próprias políticas e obrigações contratuais e legais.</p></Section>
      <Section title="7. Segurança e retenção"><p>Adotamos medidas razoáveis de segurança e acesso compatíveis com a natureza do serviço. Nenhum sistema é totalmente imune a riscos. Os dados são mantidos pelo período necessário às finalidades informadas, obrigações legais, exercício de direitos e prevenção a fraudes.</p></Section>
      <Section title="8. Direitos da titular"><p>Nos termos da LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio, eliminação quando aplicável, informação sobre compartilhamento, portabilidade nos limites regulamentares e revogação do consentimento.</p></Section>
      <Section title="9. Contato"><p>Solicitações podem ser enviadas para pejprevrecife@gmail.com ou pelo telefone (81) 3019-2443. Não indicamos encarregado formal neste documento.</p></Section>
      <Section title="10. Atualizações"><p>Esta política pode ser atualizada para refletir mudanças legais, técnicas ou operacionais. A data exibida no topo indica a versão vigente.</p></Section>
    </LegalLayout>
  );
}
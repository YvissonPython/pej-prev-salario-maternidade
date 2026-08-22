import LegalLayout from "@/components/LegalLayout";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section><h2 className="mb-3 font-serif text-xl font-semibold text-foreground">{title}</h2><div className="space-y-3">{children}</div></section>
);

export default function TermsOfUse() {
  return (
    <LegalLayout title="Termos de Uso" subtitle="Condições para utilização responsável do site e do simulador da P&J Prev.">
      <Section title="1. Aceitação"><p>Ao navegar neste site ou utilizar o simulador, você declara ciência destes Termos e da Política de Privacidade. Se não concordar, interrompa o uso dos recursos opcionais.</p></Section>
      <Section title="2. Natureza informativa"><p>O simulador oferece uma triagem preliminar e informativa. O resultado não constitui decisão do INSS, parecer definitivo, promessa de contratação ou garantia de concessão, prazo ou valor.</p></Section>
      <Section title="3. Análise individual"><p>A elegibilidade depende da legislação vigente, dos documentos, do histórico contributivo e das particularidades de cada caso. A orientação conclusiva exige análise individual por profissional habilitado quando necessário.</p></Section>
      <Section title="4. Uso adequado"><p>Você se compromete a fornecer informações verdadeiras, utilizar o site de boa-fé e não tentar comprometer sua segurança, disponibilidade ou integridade.</p></Section>
      <Section title="5. Serviços e links de terceiros"><p>O site pode direcionar para Respondi, WhatsApp, Instagram, Google Maps e outros serviços externos. Cada plataforma possui seus próprios termos e políticas, e a P&J Prev não controla sua disponibilidade contínua.</p></Section>
      <Section title="6. Propriedade intelectual"><p>Textos, identidade visual, marca, estrutura e materiais próprios são protegidos pela legislação aplicável. Não é permitida reprodução comercial sem autorização.</p></Section>
      <Section title="7. Limitações"><p>Empregamos esforços razoáveis para manter informações e recursos disponíveis, mas não garantimos operação ininterrupta ou ausência absoluta de erros. Nada nestes Termos exclui direitos assegurados pela legislação brasileira.</p></Section>
      <Section title="8. Alterações"><p>Estes Termos podem ser atualizados por razões legais, técnicas ou operacionais. A versão vigente é identificada pela data exibida no topo.</p></Section>
      <Section title="9. Legislação e contato"><p>Aplicam-se as leis brasileiras. Dúvidas podem ser enviadas para pejprevrecife@gmail.com ou pelo telefone (81) 3019-2443. P&J Prev — CNPJ 38.381.395/0001-92, Recife–PE.</p></Section>
    </LegalLayout>
  );
}
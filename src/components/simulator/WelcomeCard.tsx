import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  onStart: () => void;
}

const WelcomeCard = ({ onStart }: WelcomeCardProps) => {
  return (
    <div className="animate-card-enter">
      <div className="bg-card rounded-lg shadow-card p-8 sm:p-10 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blush flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-4 leading-tight">
          Bem-vinda!
        </h2>

        <p className="font-body text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          A <strong className="text-foreground">P&J Prev</strong> preparou este espaço para que você descubra, com total privacidade e clareza, seus direitos ao{" "}
          <strong className="text-foreground">Salário Maternidade</strong>. Responda as perguntas com calma — estamos aqui para te orientar.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-button text-primary-foreground font-display font-semibold text-lg shadow-button hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Iniciar Simulação
        </button>

        <p className="mt-6 text-sm text-muted-foreground font-body">
          ⏱ Leva menos de 1 minuto
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;

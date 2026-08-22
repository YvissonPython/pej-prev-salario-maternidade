import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { questions } from "@/data/questions";
import SimulatorHeader from "./SimulatorHeader";
import ProgressBar from "./ProgressBar";
import PrivacyBadge from "./PrivacyBadge";
import WelcomeCard from "./WelcomeCard";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";
import SimulatorFooter from "./SimulatorFooter";

type Phase = "welcome" | "questions" | "result";

const Simulator = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animKey, setAnimKey] = useState(0);

  const currentQuestion = questions[currentStep];

  const handleStart = useCallback(() => {
    setPhase("questions");
    setAnimKey((k) => k + 1);
  }, []);

  const handleSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1);
      setAnimKey((k) => k + 1);
    } else {
      setPhase("result");
      setAnimKey((k) => k + 1);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setAnimKey((k) => k + 1);
    } else {
      setPhase("welcome");
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setPhase("welcome");
    setCurrentStep(0);
    setAnswers({});
    setAnimKey((k) => k + 1);
  }, []);

  const isOptionSelected = phase === "questions" && answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-2xl flex flex-col flex-1">
        <SimulatorHeader />

        {phase === "questions" && (
          <div className="mb-6 animate-fade-in-up">
            <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {phase === "welcome" && <WelcomeCard onStart={handleStart} />}

          {phase === "questions" && currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              selectedOption={answers[currentQuestion.id] || null}
              onSelect={handleSelect}
              animationKey={animKey}
            />
          )}

          {phase === "result" && (
            <ResultCard answers={answers} onRestart={handleRestart} />
          )}
        </div>

        {/* Navigation buttons */}
        {phase === "questions" && (
          <div className="flex items-center justify-between mt-6 gap-4 animate-fade-in-up">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-border text-muted-foreground font-display font-medium text-sm hover:text-foreground hover:border-primary/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isOptionSelected}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm
                transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${
                  isOptionSelected
                    ? "bg-gradient-button text-primary-foreground shadow-button hover:shadow-glow hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {currentStep === questions.length - 1 ? "Finalizar" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Privacy badge */}
        {phase !== "result" && (
          <div className="mt-8">
            <PrivacyBadge />
          </div>
        )}

        <SimulatorFooter />
      </div>
    </div>
  );
};

export default Simulator;

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Question } from "@/data/questions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  animationKey: number;
}

const QuestionCard = ({ question, selectedOption, onSelect, animationKey }: QuestionCardProps) => {
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setJustSelected(optionId);
    onSelect(optionId);
    setTimeout(() => setJustSelected(null), 300);
  };

  return (
    <div key={animationKey} className="animate-card-enter">
      <div className="bg-card rounded-lg shadow-card p-6 sm:p-8 md:p-10">
        {/* Question header */}
        <div className="flex items-start gap-3 mb-2">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-tight">
            {question.title}
          </h2>
          {question.tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex-shrink-0 mt-1 text-gold hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                  aria-label="Ajuda sobre esta pergunta"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-xs bg-card text-foreground border-border shadow-card-hover text-sm font-body"
              >
                {question.tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {question.subtitle && (
          <p className="text-muted-foreground font-body text-base mb-6 sm:mb-8">
            {question.subtitle}
          </p>
        )}

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const isAnimating = justSelected === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`
                  group relative w-full text-left rounded-lg px-5 py-4 sm:py-5
                  border-2 transition-all duration-200 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  ${isAnimating ? "animate-option-select" : ""}
                  ${
                    isSelected
                      ? "border-primary bg-lilac-soft shadow-glow"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-card-hover"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-4">
                  {/* Radio indicator */}
                  <div
                    className={`
                      flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
                      flex items-center justify-center
                      ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40 group-hover:border-primary/60"}
                    `}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`
                      font-body font-medium text-base sm:text-lg block
                      ${isSelected ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}
                    `}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-sm text-muted-foreground mt-0.5 block">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

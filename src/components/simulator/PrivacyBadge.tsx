import { Lock } from "lucide-react";

const PrivacyBadge = () => {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-lilac-soft border border-border">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
        <Lock className="w-4 h-4 text-primary-foreground" />
      </div>
      <p className="text-sm font-body text-muted-foreground leading-snug">
        Seus dados são <strong className="text-foreground">sigilosos</strong> e usados apenas nesta análise.
      </p>
    </div>
  );
};

export default PrivacyBadge;

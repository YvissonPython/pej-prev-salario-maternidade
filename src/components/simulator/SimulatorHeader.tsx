import logo from "@/assets/logo-pjprev.jpg";

const SimulatorHeader = () => {
  return (
    <header className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <img
          src={logo}
          alt="Logo P&J Prev"
          className="w-10 h-10 rounded-full object-cover shadow-button"
        />
        <div>
          <h1 className="font-display font-bold text-lg text-foreground leading-none">
            P&J Prev
          </h1>
          <span className="text-xs font-body text-muted-foreground">
            Salário Maternidade
          </span>
        </div>
      </div>
    </header>
  );
};

export default SimulatorHeader;

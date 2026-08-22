const SimulatorFooter = () => {
  return (
    <footer className="w-full mt-12 pt-6 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-body text-muted-foreground">
        <div className="text-center sm:text-left">
          <p>
            Desenvolvido com ❤ pela <strong className="text-foreground">P&J Prev</strong>
          </p>
          <p className="text-xs mt-1">CNPJ: 38.381.395/0001-92 • Recife - PE</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+558130192443" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
            (81) 3019-2443
          </a>
          <span className="text-border">|</span>
          <a href="mailto:pejprevrecife@gmail.com" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
            E-mail
          </a>
          <span className="text-border">|</span>
          <a href="#" className="hover:text-foreground transition-colors focus:outline-none focus-visible:underline">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SimulatorFooter;

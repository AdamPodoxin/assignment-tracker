import { type ReactNode } from "react";

const SpanStyledAsButton = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      {children}
    </div>
  );
};

export default SpanStyledAsButton;

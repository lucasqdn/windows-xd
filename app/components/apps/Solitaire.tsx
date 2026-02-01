"use client";

type SolitaireProps = {
  id: string;
};

export function Solitaire({ id }: SolitaireProps) {
  return (
    <div className="h-full w-full bg-[#008000] overflow-hidden">
      <iframe
        src="https://98.js.org/programs/js-solitaire/"
        className="w-full h-full border-0 block"
        title="Solitaire"
        style={{ 
          margin: 0, 
          padding: 0,
          minWidth: '100%',
          minHeight: '100%'
        }}
      />
    </div>
  );
}

"use client";

export function PrintButton(): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-leaf"
    >
      Imprimir certificado
    </button>
  );
}

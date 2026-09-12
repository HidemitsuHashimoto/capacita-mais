type CatalogFiltersProps = {
  searchTerm: string;
  isFreeOnly: boolean;
};

export function CatalogFilters({
  searchTerm,
  isFreeOnly,
}: CatalogFiltersProps): React.ReactElement {
  return (
    <form
      action="/catalog"
      method="get"
      className="flex flex-col gap-3 rounded-3xl border border-ink/8 bg-card p-4 sm:flex-row sm:items-end"
    >
      <label className="flex-1 text-sm font-medium text-ink">
        Buscar cursos
        <input
          type="search"
          name="q"
          defaultValue={searchTerm}
          placeholder="Ex.: MEI, finanças, entrevistas"
          className="mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="free"
          value="1"
          defaultChecked={isFreeOnly}
          className="h-4 w-4 accent-forest"
        />
        Somente gratuitos
      </label>
      <button
        type="submit"
        className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-leaf"
      >
        Buscar
      </button>
    </form>
  );
}

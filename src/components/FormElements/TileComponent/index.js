export default function TileComponent({ data, selected = [], onClick }) {
  return data && data.length ? (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {data.map((dataItem) => {
        const isSelected =
          selected &&
          selected.length &&
          selected.map((item) => item.id).indexOf(dataItem.id) !== -1;

        return (
          <label
            onClick={() => onClick(dataItem)}
            key={dataItem.id}
            className={`inline-flex cursor-pointer items-center justify-center rounded-lg border px-6 py-2 font-bold transition-all ${
              isSelected
                ? "border-black bg-black text-white"
                : "border-black bg-white text-black"
            }`}
          >
            {dataItem.label}
          </label>
        );
      })}
    </div>
  ) : null;
}
function RequestCard({
  r,
  onAccept,
  onDelete,
  onSelect,
  selected,
}: {
  r: RequestData;
  onAccept: (r: RequestData, v?: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selected?: boolean;
}) {
  const guestName = typeof r.guest === "string" ? r.guest : r.guest?.userName;
  const hostName = typeof r.host === "string" ? r.host : r.host?.userName;
  const ev =
    typeof r.event === "string"
      ? { _id: r.event, title: "Event" }
      : r.event || { _id: "unknown", title: "Event" };
  return (
    <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] shadow-sm flex flex-col justify-between">
      <div className="flex gap-3">
        <EventImage src={(ev as any).image} title={(ev as any).title} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{guestName}</p>
              <p className="text-sm text-[#AEB5B9]">Host: {hostName}</p>
            </div>
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => onSelect(r._id)}
            />
          </div>
          <p className="text-sm text-[#E7E9EA] mt-2">
            Event: {(ev as any).title}
          </p>
          <p className="text-sm text-[#AEB5B9]">House: {r.house}</p>
          <p className="text-xs text-[#9AA3A7]">
            Created: {formatDateISO(r.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {r.accepted !== true && (
          <button
            onClick={() => onAccept(r, true)}
            className="px-2 py-1 bg-[#1D9BF0] text-black rounded text-sm"
          >
            Accept
          </button>
        )}
        <button
          onClick={() => onDelete(r._id)}
          className="px-2 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
    </div>
  </div>
);
export default SectionHeader;

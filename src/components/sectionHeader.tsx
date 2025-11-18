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
    <div className="flex items-center gap-4">
      {/* Icon Container with Apple-style glass effect */}
      <div className="p-3 rounded-2xl bg-white/10 dark:bg-white/20 backdrop-blur-md border border-white/20 shadow-sm flex items-center justify-center">
        {icon}
      </div>

      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-white dark:text-gray-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-gray-300 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default SectionHeader;

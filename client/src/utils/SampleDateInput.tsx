
type Props = {
  value?: string; // "YYYY-MM-DD"
  onChange: (selectedDate: string) => void;
  minDate?: string; // "YYYY-MM-DD" (optional, defaults to today)
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function SimpleDateInput({
  value = "",
  onChange,
  minDate,
  id = "date",
  placeholder = "YYYY-MM-DD",
  className = "",
}: Props) {
  const min = minDate ?? todayISO();

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          placeholder={placeholder}
          className="
            w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg shadow-sm
            text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition
          "
        />

        {/* calendar icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h12v7H4V8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const Input = ({
  value,
  handleChange,
  label,
  name,
  type,
  placeholder,
  description,
  error
}: {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  description?: string;
  error?: string;
}) => {
  const parseError = error && value === "";
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={`flex h-10 w-full rounded-md border ${
          parseError ? "border-red-500" : "border-input"
        } bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm`}
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        aria-invalid={!!parseError}
        aria-describedby={parseError ? `${name}-error` : undefined}
      />
      {description && !parseError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {parseError && (
        <p id={`${name}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

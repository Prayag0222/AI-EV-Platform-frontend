"use client";

interface Props {
  label: string;
  value: string;
  accent?: boolean;
}

export default function ModalMetaCell({
  label,
  value,
  accent = false,
}: Props) {
  return (
    <div className="rounded-xl border border-[rgba(9,20,38,.08)] bg-volt-background px-4 py-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-sec-text">
        {label}
      </p>

      <p
        className={`text-sm font-semibold leading-snug ${
          accent
            ? "text-volt-secondary"
            : "text-volt-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
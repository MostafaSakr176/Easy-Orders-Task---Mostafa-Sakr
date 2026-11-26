import { useQuantityStep } from "../../hooks/useQuantityStep";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
}

export function QuantityStepper({ value, min = 1, max, onChange }: QuantityStepperProps) {
  const step = useQuantityStep(value, min, max, onChange);
  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-[#e6e6e6]">
      <button
        type="button"
        className="grid size-10 place-items-center text-lg disabled:text-[#c4c4c4]"
        aria-label="Decrease quantity"
        disabled={!step.canDecrease}
        onClick={step.decrease}
      >
        −
      </button>
      <span className="min-w-8 text-center text-[16px] font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid size-10 place-items-center text-lg disabled:text-[#c4c4c4]"
        aria-label="Increase quantity"
        disabled={!step.canIncrease}
        onClick={step.increase}
      >
        +
      </button>
    </div>
  );
}

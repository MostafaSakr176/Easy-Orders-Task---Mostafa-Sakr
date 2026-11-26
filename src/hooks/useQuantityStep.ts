export function useQuantityStep(value: number, min: number, max: number, onChange: (value: number) => void) {
  return {
    canDecrease: value > min,
    canIncrease: value < max,
    decrease: () => onChange(value - 1),
    increase: () => onChange(value + 1),
  };
}

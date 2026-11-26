import { convertMoney, formatMoney } from "../lib/money";
import { useUiStore } from "../store/uiStore";

export function useDisplayMoney() {
  const selected = useUiStore((state) => state.currency);
  return (amount: number, source: string) => formatMoney(convertMoney(amount, source, selected), selected);
}

import { FormEvent } from "react";
import { useUiStore } from "../store/uiStore";

export function useSignIn() {
  const open = useUiStore((state) => state.signInOpen);
  const setOpen = useUiStore((state) => state.setSignInOpen);
  const setUser = useUiStore((state) => state.setUser);
  const user = useUiStore((state) => state.user);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setUser({
      name: String(data.get("name") ?? "").trim().replace(/\s+/g, " "),
      email: String(data.get("email") ?? "").trim(),
    });
  }

  return {
    open,
    user,
    close: () => setOpen(false),
    submit,
  };
}

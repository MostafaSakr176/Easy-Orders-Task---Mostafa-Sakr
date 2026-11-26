import { useRef } from "react";
import { useSignIn } from "../../hooks/useSignIn";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function SignInDialog() {
  const signIn = useSignIn();
  const { open, user, close, submit } = signIn;
  const panel = useRef<HTMLFormElement>(null);
  useFocusTrap(open, panel);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={close}>
      <form
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className="w-full max-w-sm rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <h2 className="text-xl font-semibold">{user ? "Update account" : "Sign in"}</h2>
        <label className="mt-4 block text-sm" htmlFor="sign-name">
          Name
        </label>
        <input id="sign-name" name="name" required defaultValue={user?.name} className="mt-1 h-11 w-full rounded-lg border border-[#e6e6e6] px-3" />
        <label className="mt-3 block text-sm" htmlFor="sign-email">
          Email
        </label>
        <input id="sign-email" name="email" type="email" required defaultValue={user?.email} className="mt-1 h-11 w-full rounded-lg border border-[#e6e6e6] px-3" />
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="h-11 px-4" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="h-11 rounded-lg bg-ink px-5 font-semibold text-white">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

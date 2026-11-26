import logo from "../../assets/figma/logo.png";
import iconSend from "../../assets/figma/icon-send.svg";
import iconChevron from "../../assets/figma/icon-chevron.svg";
import iconFacebook from "../../assets/figma/icon-facebook.svg";
import iconInstagram from "../../assets/figma/icon-instagram.svg";
import iconTwitter from "../../assets/figma/icon-twitter.svg";
import iconEmail from "../../assets/figma/icon-email.svg";
import iconFlag from "../../assets/figma/icon-flag.svg";
import { Icon } from "../shared/Icon";
import { useSiteFooter } from "../../hooks/useSiteFooter";

const columns = [
  { title: "Shop", links: ["My account", "Login", "Wishlist", "Cart"] },
  { title: "Information", links: ["Shipping Policy", "Returns & Refunds", "Cookies Policy", "Frequently asked"] },
  { title: "Company", links: ["About us", "Privacy Policy", "Terms & Conditions", "Contact Us"] },
];

const socials = [
  { src: iconFacebook, label: "Facebook", href: "https://www.facebook.com" },
  { src: iconInstagram, label: "Instagram", href: "https://www.instagram.com" },
  { src: iconTwitter, label: "Twitter", href: "https://twitter.com" },
  { src: iconEmail, label: "Email", href: "mailto:hello@example.com" },
];

export function SiteFooter() {
  const footer = useSiteFooter();
  const { email, setEmail, joined, subscribe, currency, language, setCurrency, toggleLanguage } = footer;

  return (
    <footer className="bg-[#f2f2f2]">
      <div className="mx-auto grid max-w-[1258px] gap-10 px-6 pb-8 pt-12 lg:grid-cols-[310px_1fr] lg:gap-x-16 lg:px-8 lg:pt-[72px]">
        <div className="text-center lg:text-left">
          <img src={logo} alt="John Lewis & Partners" className="mx-auto h-8 w-[170px] object-contain lg:mx-0 lg:object-left" />
          <form onSubmit={subscribe} className="mx-auto mt-8 max-w-[298px] lg:mx-0 lg:mt-10">
            <div className="flex items-center gap-8">
              <label className="sr-only" htmlFor="newsletter">
                Get latest offers to your inbox
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={joined ? "You're on the list" : "Get latest offers to your inbox"}
                className="w-full bg-transparent text-[16px] font-medium tracking-[0.16px] text-[#787a7c] outline-none placeholder:text-[#787a7c]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid px-4 py-2 shrink-0 place-items-center rounded-lg bg-ink text-white"
              >
                <Icon src={iconSend} size={20} className="rotate-90" />
              </button>
            </div>
            <div className="mt-0 h-px w-full bg-[#cfcfcf]" />
          </form>
          <ul className="mt-8 flex justify-center gap-4 lg:justify-start">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="grid size-9 place-items-center rounded-full bg-white"
                >
                  <Icon src={item.src} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:justify-items-end">
          {columns.map((column) => (
            <div key={column.title} className="w-full max-w-[134px]">
              <h2 className="text-sm font-semibold leading-6 text-[#121212]">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {footer.handles(link) ? (
                      <button type="button" className="text-sm leading-[22px] text-ink" onClick={() => footer.activate(link)}>
                        {link}
                      </button>
                    ) : (
                      <a href="#product" className="text-sm leading-[22px] text-ink">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 border-t border-dashed border-[#a3a3a3] px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[#3e3e59]">© John Lewis plc 2001 - 2024</p>
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium text-[#121212]"
            onClick={toggleLanguage}
          >
            <img src={iconFlag} alt="" className="h-3.5 w-[18px] object-cover" />
            {language}
            <Icon src={iconChevron} size={18} className="rotate-180" />
          </button>
          <label className="inline-flex items-center gap-1 font-medium text-[#121212]">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="bg-transparent font-medium outline-none"
            >
              <option>USD</option>
              <option>EGP</option>
              <option>GBP</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}

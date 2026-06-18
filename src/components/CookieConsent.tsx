import { useState, useEffect } from "react";

const STORAGE_KEY = "vestra-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "all");
    setVisible(false);
  }

  function essentialsOnly() {
    localStorage.setItem(STORAGE_KEY, "essentials");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas-raised shadow-fabric">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p className="text-sm text-ink-soft">
          We use essential cookies and, with your consent, analytics cookies to improve the
          experience.
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={accept} className="btn-primary">
            Accept
          </button>
          <button onClick={essentialsOnly} className="btn-ghost">
            Essentials only
          </button>
        </div>
      </div>
    </div>
  );
}

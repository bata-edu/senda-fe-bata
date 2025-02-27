import { React, useState, useEffect } from "react";

import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { Button } from "../../common/button/button";
import useDarkMode from "../../../hooks/useDarkMode";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <button className="mx-2" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default function Header() {
  const [top, setTop] = useState(true);

  const scrollHandler = () => {
    window.scrollY > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-3 rounded-2xl transition-colors duration-300 bg-white/90 dark:bg-black/90 px-3 shadow-lg shadow-black/[0.03] dark:shadow-gray-300/[0.1] backdrop-blur-sm before:pointer-events-none ">
          <div className="flex flex-1 items-center">
            <Logo />
            <DarkModeToggle />
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow items-center justify-center gap-4 text-sm lg:gap-8 mb-0 ">
              <li className="px-3 py-1 ">
                <Link
                  to="/pricing"
                  className="flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white transition hover:text-gray-900 no-underline"
                >
                  Beneficios
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  to="/customers"
                  className="flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white transition hover:text-gray-900 no-underline"
                >
                  Planes
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  to="/blog"
                  className="flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white transition hover:text-gray-900 no-underline"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          <ul className="hidden md:flex flex-1 flex-col items-end justify-center gap-3 mb-0">
            <li>
              <Button thin label="Mas info" />
            </li>
          </ul>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 text-center text-foreground">
      <small className="block text-xs">
        &copy; {currentYear} {`Najaf Shaikh. All rights reserved. `}
        <a
          href="https://najaf.in/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </small>
    </footer>
  );
}
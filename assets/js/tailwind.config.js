tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#1a1c21",
        surface: "#1b1d22",
        "surface-hi": "#1f2128",
        sunken: "#17181c",
        deep: "#16171b",
        accent: "#dfc394",
        muted: "#9ca1ab",
        outline: "#6f737d",
        bone: "#e2e4e9"
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bodoni Moda", "ui-serif", "Georgia", "serif"]
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        margin: "4rem",
        "margin-mobile": "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "2rem",
        "space-xl": "3.5rem"
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      maxWidth: { shell: "80rem" }
    }
  }
};

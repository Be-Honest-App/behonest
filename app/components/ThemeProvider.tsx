// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import Navbar from "./Navbar";


// export function ThemeProvider({
//     children,
//     ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//     const [mounted, setMounted] = React.useState(false);

//     // Wait until client-side hydration is complete
//     React.useEffect(() => {
//         setMounted(true);
//     }, []);

//     if (!mounted) {
//         // Render nothing until mounted — avoids mismatch & flicker
//         return null;
//     }

//     return <NextThemesProvider {...props}><Navbar />{children}</NextThemesProvider>;
// }

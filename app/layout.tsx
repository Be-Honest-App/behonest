import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/app/components/Navbar';
import Footer from './components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Speak Your Truth, Stay Anonymous | Be Honest',
  description: 'A safe space to express honestly, share feedback, and collect anonymous responses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased px-2 md:px-5 bg-bg text-text`}>
        <ThemeProvider>
          <div className="max-w-custom mx-auto">
            <Navbar />
            <main className="grid grid-cols-1 md:grid-cols-[360px_1fr_360px] gap-4 py-4 md:py-0">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: 'Speak Your Truth, Stay Anonymous | Be Honest',
//   description: 'A safe space to express honestly, share feedback, and collect anonymous responses.',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {/* ThemeProvider handles light/dark switching */}
//         <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

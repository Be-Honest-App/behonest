import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { Navbar } from '@/app/components/Navbar';
import Footer from './components/Footer';
import ClientLoaderWrapper from './components/ClientLoaderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'Speak Your Truth, Stay Anonymous | BeHonest',
  description: 'A safe space to express honestly, share feedback, and collect anonymous responses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased px-2 md:px-20`}>
        <link rel="icon" href="/BH.ico" sizes="any" />
        <ClientLoaderWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientLoaderWrapper>
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

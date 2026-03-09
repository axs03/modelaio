import './globals.css'

export const metadata = {
  title: 'model.aio',
  description: 'Multi-model AI comparison',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}

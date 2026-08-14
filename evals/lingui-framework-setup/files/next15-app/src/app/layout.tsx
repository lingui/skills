export const metadata = {
  title: 'Acme Dashboard',
  description: 'Internal metrics for Acme',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Tarot-Vision',
  description: 'Contextual tarot readings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

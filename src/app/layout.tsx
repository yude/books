import './globals.css'

export const metadata = {
  title: '@yude/books',
  description: 'Managing books',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="max-w-5xl md:mx-auto subpixel-antialiased mt-2">{children}</body>
    </html>
  )
}

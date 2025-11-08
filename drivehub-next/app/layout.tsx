import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'DriveMate',
  description: 'DriveMate - 나의 드라이브 메이트 🚗',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ backgroundColor: '#0b0b0b', color: '#fff' }}>
        <Navbar />
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  )
}

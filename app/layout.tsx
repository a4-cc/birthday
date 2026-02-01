import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '生日快乐 - 爸爸',
  description: '一个充满爱的 Next.js 交互网页',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
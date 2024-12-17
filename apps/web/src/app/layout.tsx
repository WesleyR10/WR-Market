import './globals.css'

import type { Metadata } from 'next'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'WR-Market',
    template: '%s | WR-Market',
  },
  description: `WR-Market é uma plataforma completa de gestão empresarial que oferece controle de estoque, vendas, compras e entregas com diferentes níveis de acesso e permissões.`,
  openGraph: {
    title: 'WR-Market',
    description: `Sistema integrado de gestão empresarial com controle de estoque, vendas, compras, fornecedores e entregas. Gerencie sua empresa com eficiência e segurança.`,
    type: 'website',
    locale: 'pt_BR',
    url: 'https://wr-market.vercel.app',
    siteName: 'WR-Market',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

import type { PropsWithChildren } from 'react'

type SeoProps = {
    title?: string
    description?: string
    ogImage?: string
    canonical?: string
}

export const Layout = ({
    children,
    title = '로또 6/45 추첨결과',
    description,
    ogImage,
    canonical,
}: PropsWithChildren<SeoProps>) => (
    <html lang='ko'>
        <head>
            <meta charSet='UTF-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>{title}</title>
            {description && <meta name='description' content={description} />}
            <meta name='author' content='Hyunseok Byun' />
            <link rel='icon' href='https://blog.gumyo.net/favicon.ico' />
            {canonical && <link rel='canonical' href={canonical} />}

            <meta property='og:type' content='website' />
            <meta property='og:title' content={title} />
            {description && <meta property='og:description' content={description} />}
            {ogImage && <meta property='og:image' content={ogImage} />}
            {ogImage && <meta property='og:image:width' content='1200' />}
            {ogImage && <meta property='og:image:height' content='630' />}

            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title} />
            {description && <meta name='twitter:description' content={description} />}
            {ogImage && <meta name='twitter:image' content={ogImage} />}

            <link rel='stylesheet' href='/globals.css' />
        </head>
        <body className='min-h-screen bg-background antialiased'>
            <header className='border-b'>
                <div className='max-w-2xl mx-auto p-4'>
                    <a href='/' className='text-xl font-bold hover:opacity-80'>
                        🎱 로또 6/45
                    </a>
                </div>
            </header>
            <main className='py-6'>{children}</main>
        </body>
    </html>
)

import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { Layout } from '../../ui/layout'

describe('Layout SEO', () => {
    test('기본 타이틀 렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).toContain('<title>로또 6/45 추첨결과</title>')
    })

    test('커스텀 타이틀 렌더링', () => {
        const html = renderToString(<Layout title='제 1210회 추첨결과 - 로또 6/45'>content</Layout>)
        expect(html).toContain('<title>제 1210회 추첨결과 - 로또 6/45</title>')
    })

    test('description 메타태그 렌더링', () => {
        const html = renderToString(<Layout description='1, 7, 9, 17, 27, 38 + 31'>content</Layout>)
        expect(html).toContain('name="description" content="1, 7, 9, 17, 27, 38 + 31"')
    })

    test('description 없으면 메타태그 미렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).not.toContain('name="description"')
    })

    test('og:title 렌더링', () => {
        const html = renderToString(<Layout title='제 1210회 추첨결과 - 로또 6/45'>content</Layout>)
        expect(html).toContain('property="og:title" content="제 1210회 추첨결과 - 로또 6/45"')
    })

    test('og:description 렌더링', () => {
        const html = renderToString(<Layout description='1, 2, 3'>content</Layout>)
        expect(html).toContain('property="og:description" content="1, 2, 3"')
    })

    test('og:image 렌더링', () => {
        const html = renderToString(<Layout ogImage='https://luck.gumyo.net/og/1210'>content</Layout>)
        expect(html).toContain('property="og:image" content="https://luck.gumyo.net/og/1210"')
        expect(html).toContain('property="og:image:width" content="1200"')
        expect(html).toContain('property="og:image:height" content="630"')
    })

    test('og:image 없으면 메타태그 미렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).not.toContain('og:image')
    })

    test('twitter:card summary_large_image 설정', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).toContain('name="twitter:card" content="summary_large_image"')
    })

    test('twitter:image 렌더링', () => {
        const html = renderToString(<Layout ogImage='https://luck.gumyo.net/og/1210'>content</Layout>)
        expect(html).toContain('name="twitter:image" content="https://luck.gumyo.net/og/1210"')
    })

    test('author 메타태그 렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).toContain('name="author" content="Hyunseok Byun"')
    })

    test('favicon 렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).toContain('href="https://blog.gumyo.net/favicon.ico"')
    })

    test('canonical URL 렌더링', () => {
        const html = renderToString(<Layout canonical='https://luck.gumyo.net/episode/1210'>content</Layout>)
        expect(html).toContain('rel="canonical" href="https://luck.gumyo.net/episode/1210"')
    })

    test('canonical 없으면 미렌더링', () => {
        const html = renderToString(<Layout>content</Layout>)
        expect(html).not.toContain('canonical')
    })
})

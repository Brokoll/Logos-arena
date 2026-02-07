import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://logosarena.com'

    // 정적 페이지들
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/notice`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ranking`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
    ]

    // 동적 토론 페이지들
    try {
        const supabase = await createServerClient()
        const { data: debates } = await supabase
            .from('debates')
            .select('id, created_at')
            .eq('status', 'active')

        const debatePages: MetadataRoute.Sitemap = (debates || []).map((debate) => ({
            url: `${baseUrl}/debate/${debate.id}`,
            lastModified: new Date(debate.created_at),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))

        return [...staticPages, ...debatePages]
    } catch {
        return staticPages
    }
}

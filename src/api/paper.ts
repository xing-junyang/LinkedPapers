import axios from 'axios'

export interface SearchParams {
    keywords: string
    page: number
    size: number
    sortBy: 'relevance' | 'year'
    category?: string
    yearStart?: number
    yearEnd?: number
}

export interface Paper {
    paperId: string
    title: string
    abstract: string
    year: number
    category: string
    citationCount: number
}

interface SearchResponse {
    code: number
    data: {
        total: number
        papers: Paper[]
    }
}

export interface RecommendedPaper {
    paperId: string
    title: string
    abstract: string
    reason: string
    similarity: number
}

interface RecommendationResponse {
    code: number
    data: {
        recommendations: RecommendedPaper[]
    }
}

export interface PaperDetail {
    code: number
    data: {
        paperId: string
        title: string
        abstract: string
        year: number
        category: string
        vector: number[]
        citations: [
            {
                paperId: string
                title: string
                year: number
            }
        ]
        similarPapers?: [
            {
                paperId: string
                title: string
                similarity: number
            }
        ]
        sameCategoryPapers?: [
            {
                paperId: string
                title: string
            }
        ]
    }
}

export const paperApi = {
    // 搜索论文
    search(params: SearchParams) {
        return axios.get<SearchResponse>('/api/papers/search', { params })
    },

    // 获取推荐论文
    getRecommendations() {
        return axios.get<RecommendationResponse>('/api/user/recommendations',{headers: {token: sessionStorage.getItem('token')}})
    },

    // 获取论文详情
    getPaperDetail(paperId: string) {
        return axios.get<PaperDetail>(`/api/papers/${paperId}`)
    }
}
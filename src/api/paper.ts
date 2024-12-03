import axios from 'axios'

export interface SearchParams {
    keywords: string
    page: number
    size: number
    sortBy: 'RELEVANCE' | 'NEWEST'
    category?: string
    yearStart?: number
    yearEnd?: number
}

interface Citation {
    citationCount: number
}

export interface Paper {
    paperId: string
    title: string
    abstractText: string
    year: string
    category: string
    citations: Citation
}

interface SearchResponse {
    code: number
    data: Paper[]
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
        abstractText: string
        year: number
        category: string
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
        return axios.post<SearchResponse>('/api/papers/search', params)
    },

    // 获取推荐论文
    getRecommendations() {
        return axios.get<RecommendationResponse>('/api/user/recommendations',{headers: {token: sessionStorage.getItem('token')}})
    },

    // 获取论文详情
    getPaperDetail(paperId: string) {
        return axios.get<PaperDetail>(`/api/papers/${paperId}` ,{headers: {token: sessionStorage.getItem('token')}})
    }
}
<template>
	<div class="paper-suggest-container">
		<el-card class="header-card">
			<template #header>
				<div class="header">
					<h2 class="title">论文推荐</h2>
					<el-button type="primary" @click="refreshRecommendations" :loading="loading">
						<el-icon><Refresh /></el-icon>
						刷新推荐
					</el-button>
				</div>
			</template>
			<div class="description">
				基于您的浏览历史，为您推荐以下相关论文
			</div>
		</el-card>

		<!-- 推荐论文列表 -->
		<div class="recommendations-list" v-loading="loading">
			<el-row :gutter="20">
				<el-col :xs="24" :sm="12" :md="8" v-for="paper in recommendations"
				        :key="paper.paperId">
					<el-card class="paper-card" :body-style="{ padding: '0px' }">
						<!-- 相似度指示器 -->
						<div class="similarity-indicator">
							<el-progress
								type="dashboard"
								:percentage="Math.round(paper.similarity * 100)"
								:color="getSimilarityColor"
								:width="40"
							>
								<template #default="{ percentage }">
									<span class="percentage-value">{{ percentage }}%</span>
								</template>
							</el-progress>
						</div>

						<div class="paper-content">
							<router-link
								:to="`/paperDetail/${paper.paperId}`"
								class="paper-title"
							>
								{{ paper.title }}
							</router-link>

							<div class="paper-abstract">
								{{ paper.abstract }}
							</div>

							<el-divider>推荐理由</el-divider>

							<div class="recommendation-reason">
								<el-icon><InfoFilled /></el-icon>
								{{ paper.reason }}
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>

			<!-- 无推荐时显示 -->
			<el-empty
				v-if="!loading && recommendations.length === 0"
				description="暂无推荐论文"
				class="no-recommendations"
			>
					<el-button type="primary" @click="goToSearch">
						去搜索论文
					</el-button>
			</el-empty>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, InfoFilled } from '@element-plus/icons-vue'
import { paperApi, type RecommendedPaper } from '@/api/paper'

const router = useRouter()
const loading = ref(false)
const recommendations = ref<RecommendedPaper[]>([])

const getSimilarityColor = (percentage: number) => {
	if (percentage < 60) return '#909399'
	if (percentage < 80) return '#E6A23C'
	return '#67C23A'
}

const loadRecommendations = async () => {
	loading.value = true
	try {
		const { data: response } = await paperApi.getRecommendations()
		if (response.code === 0) {
			recommendations.value = response.data.recommendations
		} else {
			ElMessage.error('获取推荐失败')
		}
	} catch (error) {
		ElMessage.error('获取推荐出错，请稍后重试')
	} finally {
		loading.value = false
	}
}

const refreshRecommendations = () => {
	loadRecommendations()
}

const goToSearch = () => {
	router.push('/search')
}

onMounted(() => {
	loadRecommendations()
})
</script>

<style scoped>
.paper-suggest-container {
	padding: 20px;
	max-width: 1600px;
	width: 80%;
	margin: 0 auto;
}

.header-card {
	margin-bottom: 20px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title {
	margin: 0;
	font-size: 20px;
	font-weight: 500;
}

.description {
	color: #606266;
	font-size: 14px;
}

.recommendations-list {
	margin-top: 20px;
}

.paper-card {
	margin-bottom: 20px;
	position: relative;
	transition: all 0.3s;
}

.paper-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.similarity-indicator {
	position: absolute;
	top: 10px;
	right: 10px;
}

.percentage-value {
	font-size: 12px;
	line-height: 1;
}

.paper-content {
	padding: 20px;
}

.paper-title {
	font-size: 16px;
	color: #2291b9;
	text-decoration: none;
	font-weight: 500;
	line-height: 1.5;
	display: block;
	margin-right: 50px;
	margin-bottom: 10px;
}

.paper-title:hover {
	color: #66b1ff;
}

.paper-abstract {
	color: #606266;
	font-size: 14px;
	line-height: 1.6;
	margin: 10px 0;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.recommendation-reason {
	color: #67C23A;
	font-size: 14px;
	padding: 10px;
	background-color: #f0f9eb;
	border-radius: 4px;
	display: flex;
	align-items: flex-start;
	gap: 8px;
}

.recommendation-reason .el-icon {
	margin-top: 3px;
}

.no-recommendations {
	margin-top: 40px;
}

.el-button {
	background-color: #2291b9;
	border-color: #2291b9;
}
</style>
<template>
	<div class="paper-search-container">
		<!-- 搜索区域 -->
		<el-card class="search-card">
			<el-form :model="searchForm" @submit.prevent="handleSearch">
				<el-row :gutter="20">
					<el-col :span="6"></el-col>
					<el-col :span="12">
						<el-form-item>
							<el-input
								v-model="searchForm.keywords"
								placeholder="请输入关键词搜索论文"
								clearable
								@keyup.enter="handleSearch"
							>
								<template #append>
									<el-button @click="handleSearch" :loading="loading">
										<el-icon><Search /></el-icon> 搜索
									</el-button>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6"></el-col>
				</el-row>

				<!-- 高级搜索选项 -->
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="排序方式">
							<el-select v-model="searchForm.sortBy" style="width: 100%">
								<el-option label="相关度" value="relevance" />
								<el-option label="发表年份" value="year" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="论文类别">
							<el-select v-model="searchForm.category" clearable style="width: 100%">
								<el-option label="全部类别" value="" />
								<el-option label="计算机科学" value="CS" />
								<el-option label="人工智能" value="AI" />
								<el-option label="机器学习" value="ML" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="发表年份">
							<el-date-picker
								v-model="yearRange"
								type="yearrange"
								range-separator="至"
								start-placeholder="起始年份"
								end-placeholder="结束年份"
								value-format="YYYY"
								:default-value="[new Date(2010,0,1), new Date(2020,0,1)]"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 搜索结果列表 -->
		<el-card v-if="papers.length > 0" class="result-card">
			<div class="search-stats">
				找到 {{ total }} 条结果
			</div>

			<el-divider />

			<div class="paper-list">
				<div v-for="paper in papers" :key="paper.paperId" class="paper-item">
					<router-link
						:to="`/paperDetail/${paper.paperId}`"
						class="paper-title"
					>
						{{ paper.title }}
					</router-link>
					<div class="paper-info">
						<el-tag size="small">{{ paper.category }}</el-tag>
						<span class="year">{{ paper.year }}年</span>
						<span class="citations">被引用 {{ paper.citationCount }} 次</span>
					</div>
					<div class="paper-abstract">{{ paper.abstract }}</div>
				</div>
			</div>

			<!-- 分页 -->
			<div class="pagination">
				<el-pagination
					v-model:current-page="searchForm.page"
					v-model:page-size="searchForm.size"
					:total="total"
					:page-sizes="[10, 20, 30, 50]"
					layout="total, sizes, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</el-card>

		<!-- 无搜索结果时显示 -->
		<el-empty
			v-else-if="hasSearched"
			description="未找到相关论文"
			class="result-empty"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { paperApi, type Paper, type SearchParams } from '@/api/paper'

const loading = ref(false)
const hasSearched = ref(false)
const total = ref(0)
const papers = ref<Paper[]>([])
const yearRange = ref<[string, string]>(['', ''])

const searchForm = reactive<SearchParams>({
	keywords: '',
	page: 1,
	size: 10,
	sortBy: 'relevance',
	category: '',
	yearStart: undefined,
	yearEnd: undefined
})

// 监听年份范围变化
watch(yearRange, (newValue) => {
	if (newValue) {
		if(newValue[0]>2024 || newValue[1]>2024){
			ElMessage.error('请输入正确的年份')
			yearRange.value = ['','']
			searchForm.yearStart = undefined
			searchForm.yearEnd = undefined
			return
		}
		searchForm.yearStart = newValue[0] ? parseInt(newValue[0]) : undefined
		searchForm.yearEnd = newValue[1] ? parseInt(newValue[1]) : undefined
	} else {
		searchForm.yearStart = undefined
		searchForm.yearEnd = undefined
	}
})

const handleSearch = async () => {
	if (!searchForm.keywords.trim()) {
		ElMessage.warning('请输入搜索关键词')
		return
	}

	loading.value = true
	try {
		const { data: response } = await paperApi.search(searchForm)
		if (response.code === 0) {
			papers.value = response.data.papers
			total.value = response.data.total
			hasSearched.value = true
		} else {
			ElMessage.error('搜索失败，请重试')
		}
	} catch (error) {
		ElMessage.error('搜索出错，请稍后重试')
	} finally {
		loading.value = false
	}
}

const handleSizeChange = (size: number) => {
	searchForm.size = size
	searchForm.page = 1
	handleSearch()
}

const handleCurrentChange = (page: number) => {
	searchForm.page = page
	handleSearch()
}
</script>

<style scoped>
.paper-search-container {
	padding: 20px;
	max-width: 1600px;
	width: 80%;
	margin: 0 auto;
}

.search-card {
	margin-bottom: 20px;
}

.result-card {
	margin-top: 20px;
}

.search-stats {
	color: #606266;
	font-size: 14px;
}

.paper-list {
	margin-top: 20px;
}

.paper-item {
	padding: 20px 0;
	border-bottom: 1px solid #EBEEF5;
}

.paper-item:last-child {
	border-bottom: none;
}

.paper-title {
	font-size: 18px;
	color: #409EFF;
	text-decoration: none;
	font-weight: 500;
	line-height: 1.5;
	display: block;
	margin-bottom: 10px;
}

.paper-title:hover {
	color: #66b1ff;
}

.paper-info {
	margin: 10px 0;
	font-size: 14px;
	color: #606266;
}

.paper-info > * {
	margin-right: 15px;
}

.paper-abstract {
	color: #606266;
	font-size: 14px;
	line-height: 1.6;
	margin-top: 10px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.pagination {
	margin-top: 20px;
	text-align: center;
}

.result-empty {
	margin-top: 40px;
}

.year, .citations {
	color: #909399;
}
</style>
<template>
	<div class="paper-detail" v-loading="loading">
		<el-card class="main-content">
			<template #header>
				<div class="title">{{ paperInfo?.title }}</div>
				<div class="meta">
					<el-tag>{{ paperInfo?.year }}</el-tag>
					<el-tag type="success">{{ paperInfo?.category }}</el-tag>
				</div>
			</template>

			<div class="abstract">
				<div class="section-title">摘要</div>
				<p>{{ paperInfo?.abstract }}</p>
			</div>

			<div class="citations">
				<div class="section-title">引用论文</div>
				<el-table :data="paperInfo?.citations" style="width: 100%">
					<el-table-column prop="title" label="标题">
						<template #default="scope">
							<router-link :to="`/paperDetail/${scope.row.paperId}`">
								{{ scope.row.title }}
							</router-link>
						</template>
					</el-table-column>
					<el-table-column prop="year" label="年份" width="100" />
				</el-table>
			</div>
		</el-card>

		<div class="side-content">
			<el-card class="similar-papers">
				<template #header>
					<div class="section-title">相似论文</div>
				</template>

				<template v-if="paperInfo?.similarPapers">
					<el-table :data="paperInfo.similarPapers" style="width: 100%">
						<el-table-column prop="title" label="标题">
							<template #default="scope">
								<router-link :to="`/paperDetail/${scope.row.paperId}`">
									{{ scope.row.title }}
								</router-link>
							</template>
						</el-table-column>
						<el-table-column prop="similarity" label="相似度" width="100">
							<template #default="scope">
								{{ (scope.row.similarity * 100).toFixed(1) }}%
							</template>
						</el-table-column>
					</el-table>
				</template>
				<template v-else>
					<el-empty description="VIP专享功能">
						<el-button type="primary" @click="$router.push('/user')">
							前往用户中心开通会员
						</el-button>
					</el-empty>
				</template>
			</el-card>

			<el-card class="same-category">
				<template #header>
					<div class="section-title">同类论文</div>
				</template>

				<template v-if="paperInfo?.sameCategoryPapers">
					<el-table :data="paperInfo.sameCategoryPapers" style="width: 100%">
						<el-table-column prop="title" label="标题">
							<template #default="scope">
								<router-link :to="`/paperDetail/${scope.row.paperId}`">
									{{ scope.row.title }}
								</router-link>
							</template>
						</el-table-column>
					</el-table>
				</template>
				<template v-else>
					<el-empty description="VIP专享功能">
						<el-button type="primary" @click="$router.push('/user')">
							前往用户中心开通会员
						</el-button>
					</el-empty>
				</template>
			</el-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { paperApi } from '@/api/paper'
import type { PaperDetail } from '@/api/paper'
import {ElMessage} from "element-plus";
import router from "@/router";

const route = useRoute()
const loading = ref(false)
const paperInfo = ref<PaperDetail['data']>()

const fetchPaperDetail = async () => {
	loading.value = true
	try {
		const paperId = route.params.paperId as string
    console.log("paperId: "+paperId)
		const { data: response }  = await paperApi.getPaperDetail(paperId)
    console.log(response)
		if(response.code === 0){
			paperInfo.value = response.data
		}else{
			ElMessage.error('获取论文详情失败')
			return
		}
	} catch (error) {
		ElMessage.error('获取论文详情失败')
	}
	//TODO: the following is the Mock data, which should be replaced after the backend is implemented
	// paperInfo.value = {
	// 	paperId: '1',
	// 	title: '论文标题',
	// 	year: '2021',
	// 	category: '计算机科学',
	// 	abstract: '   论文摘要内容，否额外的费用。在这里，我们提出了一种新的方法来解决这个问题。我们的方法基于深度学习技术，可以在几秒钟内完成这项工作。我们的实验结果表明，我们的方法比现有方法更快，更准确。是的，这就是我们的论文摘要。和铁壳打破了。我们的方法基于深度学习技术，可以在几秒钟内完成这项工作。我们的实验结果表明，我们的方法比现有方法更快，更准确。是的，这就是我们的论文摘要。和铁壳打破了。我们的方法基于深度学习技术，可以在几秒钟内完成这项工作。我们的实验结果表明，我们的方法比现有方法更快，更准确。是的，这就是我们的论文摘要。和铁壳打破了。和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳和铁壳',
	// 	citations: [
	// 		{title: '引用论文1', year: '2019', paperId: '1'},
	// 		{title: '引用论文2', year: '2020', paperId: '2'},
	// 		{title: '引用论文3', year: '2021', paperId: '3'}
	// 	],
	// 	similarPapers: [
	// 		{title: '相似论文1', similarity: 0.8, paperId: '4'},
	// 		{title: '相似论文2', similarity: 0.7, paperId: '5'},
	// 		{title: '相似论文3', similarity: 0.6, paperId: '6'}
	// 	],
	// 	sameCategoryPapers: [
	// 		{title: '同类论文1', paperId: '7'},
	// 		{title: '同类论文2', paperId: '8'},
	// 		{title: '同类论文3', paperId: '9'}
	// 	]
	// }
	loading.value = false
}

const checkLogin = () => {
  if (!sessionStorage.getItem('token')) {
    ElMessage.warning('请先登录')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
}

onMounted(() => {
  checkLogin()
	fetchPaperDetail()
})
</script>

<style scoped>
.paper-detail {
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: 20px;
	padding: 20px;
}

.main-content {
	grid-column: 1;
}

.side-content {
	grid-column: 2;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 10px;
}

.meta {
	display: flex;
	gap: 10px;
}

.section-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 15px;
}

.abstract {
	margin-bottom: 30px;
}

.abstract p {
	line-height: 1.6;
	color: #666;
}

:deep(.el-card__header) {
	padding: 15px 20px;
}

:deep(.el-table) {
	margin-top: 10px;
}

a {
	color: #409eff;
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}
</style>
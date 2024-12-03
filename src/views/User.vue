<template>
	<div class="user-center">
		<!-- 欢迎信息 -->
		<el-card class="welcome-card">
			<div class="welcome-content">
				<div class="welcome-text">
					<h2>欢迎回来，{{ userStore.username }}</h2>
					<p>上次登录时间：{{ formatDate(userStore.lastLoginTime) }}</p>
				</div>
			</div>
		</el-card>

		<el-row :gutter="20" class="info-section">
			<!-- 基础信息卡片 -->
			<el-col :xs="24" :sm="24" :md="12">
				<el-card class="user-info-card">
					<template #header>
						<div class="card-header">
							<span>基础信息</span>
						</div>
					</template>
					<el-descriptions :column="1" border v-model="userStore">
						<el-descriptions-item label="用户名">
							{{ userStore.username }}
						</el-descriptions-item>
						<el-descriptions-item label="邮箱">
							{{ userStore.email }}
						</el-descriptions-item>
						<el-descriptions-item label="注册时间">
							{{ formatDate(userStore.registerTime) }}
						</el-descriptions-item>
					</el-descriptions>
				</el-card>
			</el-col>

			<!-- 会员信息卡片 -->
			<el-col :xs="24" :sm="24" :md="12">
				<el-card class="vip-card" :class="{ 'is-vip': isVip }">
					<template #header>
						<div class="card-header">
							<span>会员信息</span>
							<el-tag :type="isVip ? 'success' : 'info'">
								{{ isVip ? 'VIP会员' : '普通用户' }}
							</el-tag>
						</div>
					</template>

					<div v-if="isVip" class="vip-info">
						<el-icon><GoldMedal /></el-icon>
						<div class="vip-details">
							<h3>VIP会员</h3>
							<p>到期时间：{{ formatDate(vipExpireTime) }}</p>
						</div>
					</div>

					<div v-else class="upgrade-vip">
<!--						显示标语：开通会员享受更多权益-->
						<el-row class="upgrade-vip-note">
							<p>开通会员享受更多权益</p>
						</el-row>

						<el-button type="primary" @click="handleUpgradeVip">
							立即开通
						</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 浏览历史 -->
		<el-card class="history-card">
			<template #header>
				<div class="card-header">
					<span>浏览历史</span>
					<el-button type="primary" text @click="loadHistory">
						刷新浏览历史
					</el-button>
				</div>
			</template>

			<el-table
				v-loading="loading"
				:data="historyList"
				style="width: 100%"
			>
				<el-table-column prop="title" label="论文标题">
					<template #default="{ row }">
						<router-link
							:to="`/paperDetail/${row.paperId}`"
							class="paper-link"
						>
							{{ row.title }}
						</router-link>
					</template>
				</el-table-column>
				<el-table-column prop="viewTime" label="浏览时间" width="180">
					<template #default="{ row }">
						{{ formatDate(row.viewTime) }}
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination-container">
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:total="total"
					:page-sizes="[10, 20, 30, 50]"
					layout="total, sizes, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi, type HistoryItem } from '@/api/user'
import {GoldMedal} from '@element-plus/icons-vue'

import dayjs from 'dayjs'

const userStore = ref({
  userId: '',
	username: '',
	email: '',
	registerTime: '',
	lastLoginTime: '',
	vipExpireTime: '',
	role: ''
})


// 会员相关
const isVip = ref(userStore.value.role === 'VIP')
const vipExpireTime = ref('2024-1-1') // 示例日期

// 浏览历史相关
const loading = ref(false)
const historyList = ref<HistoryItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatDate = (date: string | undefined) => {
	if (!date) return '暂无数据'
	return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const loadUserStore = async () => {
	//TODO: 从后端获取真实用户信息
  const userInfo = await userApi.getUserInfo()
  console.log(userInfo)
	userStore.value = {
    userId: '1',
		username: 'admin',
		email: 'example@user.com',
		registerTime: '2021-01-01 00:00:00',
		lastLoginTime: '2021-01-01 00:00:00',
		vipExpireTime: '2024-12-31',
		role: 'NORMAL'
	}
  userStore.value = userInfo.data.data
	isVip.value = userStore.value.role === 'VIP'
	vipExpireTime.value = userStore.value.vipExpireTime
	//TODO: 更新 SessionStorage 中的用户 VIP 信息
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo.data.data))
}

const loadHistory = async () => {
	loading.value = true
	try {
		const { data: response } = await userApi.getHistory({
			page: currentPage.value,
			size: pageSize.value
		})
		if (response.code === 0) {
			historyList.value = response.data.history
			total.value = response.data.total
		}
	} catch (error) {
		ElMessage.error('获取浏览历史失败')
	} finally {
		loading.value = false
	}
}

const handleSizeChange = (val: number) => {
	pageSize.value = val
	loadHistory()
}

const handleCurrentChange = (val: number) => {
	currentPage.value = val
	loadHistory()
}

const handleUpgradeVip = async () => {
	try {
		const { data: response } = await userApi.updateRole(userStore.value.userId, 'VIP')
		if (response.code === 0) {
			ElMessage.success('开通成功，获得一个月 VIP')
			isVip.value = true
			userStore.value.role = 'VIP'
		}
	} catch (error) {
		ElMessage.error('开通失败，请稍后重试')
	}
}

onMounted(() => {
	loadHistory()
	loadUserStore()
})
</script>

<style scoped>

.user-center {
	padding: 20px;
	max-width: 1600px;
	width: 80%;
	margin: 0 auto;
}

.welcome-card {
	margin-bottom: 20px;
}

.welcome-content {
	display: flex;
	align-items: center;
	gap: 20px;
}

.welcome-text h2 {
	margin: 0;
	font-size: 24px;
	color: #303133;
}

.welcome-text p {
	margin: 8px 0 0;
	color: #909399;
}

.info-section {
	margin-bottom: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.vip-card {
	height: 100%;
}

.vip-card.is-vip {
	background: linear-gradient(135deg, #fdfbfb 0%, #fff6e6 100%);
}

.vip-info {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px;
}

.vip-info .el-icon {
	font-size: 40px;
	color: #e6a23c;
}

.vip-details h3 {
	margin: 0;
	color: #e6a23c;
}

.vip-details p {
	margin: 8px 0 0;
	color: #606266;
}

.upgrade-vip {
	padding: 20px;
	text-align: center;
}

.upgrade-vip-note {
	display: flex;
	justify-content: center;
	padding-bottom: 20px;
}

.history-card {
	margin-top: 20px;
}

.paper-link {
	color: #409EFF;
	text-decoration: none;
}

.paper-link:hover {
	color: #66b1ff;
	text-decoration: underline;
}

.pagination-container {
	margin-top: 20px;
	display: flex;
	justify-content: center;
}
</style>
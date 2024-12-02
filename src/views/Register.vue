<template>
	<div class="register-container">
		<el-card class="register-card">
			<h2 class="title">Linked Papers 用户注册</h2>
			<el-form
				ref="registerFormRef"
				:model="registerForm"
				:rules="registerRules"
				label-width="80px"
			>
				<el-form-item label="用户名" prop="username">
					<el-input
						v-model="registerForm.username"
						placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input
						v-model="registerForm.email"
						placeholder="请输入邮箱"
					/>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						v-model="registerForm.password"
						type="password"
						placeholder="请输入密码"
						show-password
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleRegister" :loading="loading" class="custom-button">
						注册
					</el-button>
				</el-form-item>
			</el-form>
			<div class="login-link">
				已有账号？<router-link to="/login">立即登录</router-link>
			</div>
			<div class="login-link">
				<router-link to="/">返回首页</router-link>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { userApi } from '@/api/user'

const router = useRouter()

const registerForm = reactive({
	username: '',
	email: '',
	password: ''
})

const registerRules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 2, message: '用户名长度不能小于2位', trigger: 'blur' }
	],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
	]
}

const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const handleRegister = async () => {
	if (!registerFormRef.value) return

	await registerFormRef.value.validate(async (valid) => {
		if (valid) {
			loading.value = true
			try {
				const { data: response } = await userApi.register(registerForm)
				if (response.code === 0) {
					ElMessage.success('注册成功')
					await router.push('/login')
					// TODO: router.push('/login')
				} else {
					ElMessage.error(response.message)
				}
			} catch (error) {
				ElMessage.error('注册失败，请稍后重试')
			} finally {
				loading.value = false
			}
		}
	})
}
</script>

<style scoped>
.register-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #2291b9;
}

.register-card {
	width: 400px;
}

.title {
	text-align: center;
	margin-bottom: 30px;
	color: #303133;
}

.el-form{
	padding-right: 30px;
}

.el-form-item:last-child {
	margin-bottom: 0;
}

.el-button {
	width: 100%;
}

.login-link {
	margin-top: 15px;
	text-align: center;
	font-size: 14px;
}

.login-link a {
	color: #2291B9;
	text-decoration: none;
}

.custom-button{
	background-color: #2291B9;
	border-color: #10708f;
}

.custom-button:hover {
	background-color: #59bad3;
	border-color: #59bad3;
}
</style>
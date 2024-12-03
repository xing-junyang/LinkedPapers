<template>
	<div class="login-container">
		<el-card class="login-card">
			<h2 class="title">Linked Papers 用户登录</h2>
			<el-form
				ref="loginFormRef"
				:model="loginForm"
				:rules="loginRules"
				label-width="80px"
			>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="loginForm.email" placeholder="请输入邮箱" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						v-model="loginForm.password"
						type="password"
						placeholder="请输入密码"
						show-password
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleLogin" :loading="loading" class="custom-button">
						登录
					</el-button>
				</el-form-item>
			</el-form>
			<div class="register-link">
				还没有账号？<router-link to="/register">立即注册</router-link>
			</div>
			<div class="register-link">
				<router-link to="/">返回首页</router-link>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { userApi } from '@/api/user'
import {useRouter} from "vue-router";

const router = useRouter()

const loginForm = reactive({
	email: '',
	password: ''
})

const loginRules = {
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
	]
}

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const handleLogin = async () => {
	if (!loginFormRef.value) return

	await loginFormRef.value.validate(async (valid) => {
		if (valid) {
			loading.value = true
			try {
				const {data: response} = await userApi.login(loginForm)
        console.log(response)
				if (response.code === 0) {
					ElMessage.success('登录成功')
					sessionStorage.setItem('token', response.data)
          const userInfo = await userApi.getUserInfo()
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo.data.data))
					// sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
					await router.push({path: '/'})
				} else {
					ElMessage.error(response.message)
				}
			} catch (error) {
				ElMessage.error('登录出错')
			} finally {
				loading.value = false
			}
		}
	})
}
</script>

<style scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #2291b9;
}

.login-card {
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

.register-link {
	margin-top: 15px;
	text-align: center;
	font-size: 14px;
}

.register-link a {
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
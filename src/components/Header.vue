<script setup lang="ts">

import {ElMessageBox} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {Search} from "@element-plus/icons-vue";

const router = useRouter()

const hasLogin = ref(false)
const userName = ref("用户")
const isVIP = ref(false)

onMounted(() => {
	hasLogin.value = sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !== '';
	if (hasLogin.value && sessionStorage.getItem('userInfo')!== null) {
		userName.value = JSON.parse(sessionStorage.getItem('userInfo')).username
		isVIP.value = JSON.parse(sessionStorage.getItem('userInfo')).role === 'VIP'
	}
})

watch(useRoute(), () => {
	hasLogin.value = sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !== '';
	if (hasLogin.value && sessionStorage.getItem('userInfo')!==null) {
		userName.value = JSON.parse(sessionStorage.getItem('userInfo')).username
		isVIP.value = JSON.parse(sessionStorage.getItem('userInfo')).role === 'VIP'
	}
})

function handleLogout() {
	ElMessageBox.confirm(
		'是否要退出登录？',
		'提示',
		{
			customClass: "customDialog",
			confirmButtonText: '是',
			cancelButtonText: '否',
			type: "warning",
			showClose: false,
			roundButton: true,
			center: true
		}
	).then(() => {
		sessionStorage.setItem('token', '')
		sessionStorage.setItem('userInfo', '')
		router.push({path: "/login"})
	})
}
</script>

<template>
	<el-header class="header" height="60px">
		<el-row :gutter="10">
			<el-col :span="6" class="header-left">
				<router-link to="/" v-slot="{navigate}">
					<h1 class="title" @click="navigate">
						Linked Papers
						<el-icon><Search /></el-icon>
					</h1>
				</router-link>
			</el-col>
			<el-col :span="2">
			</el-col>
			<el-col :span="16" class="header-right" style="justify-content: end">
				<router-link to="/login" v-slot="{navigate}" v-if="!hasLogin">
					<button class="btn btn-login" @click="navigate">
						<span>登录</span>
					</button>
				</router-link>
				<router-link to="/register" v-slot="{navigate}" v-if="!hasLogin">
					<button class="btn btn-register" @click="handleRegister">
						<span>注册</span>
					</button>
				</router-link>
				<div v-if="hasLogin">
					<span class="user-info">欢迎，{{ userName }}</span>
				</div>
				<div v-if="isVIP">
					<span class="user-info vip">VIP</span>
				</div>

				<router-link to="/paperSuggest" v-slot="{navigate}" v-if="hasLogin">
					<button class="btn btn-suggest" @click="navigate">
						<span>文献推荐</span>
					</button>
				</router-link>
				<router-link to="/user" v-slot="{navigate}" v-if="hasLogin">
					<button class="btn btn-login" @click="navigate">
						<span>用户中心</span>
					</button>
				</router-link>
				<button v-if="hasLogin" class="btn btn-login" @click="handleLogout">
					<span>登出</span>
				</button>
			</el-col>
		</el-row>
	</el-header>
</template>

<style scoped>
.header {
	background: linear-gradient(to right, #2291b9, #1798c7);
	border-bottom-left-radius: 15px;
	border-bottom-right-radius: 15px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.header-left {
	display: flex;
	align-items: center;
}

.title {
	color: #fff;
	font-size: 1.5rem;
	font-weight: 600;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}

.header-right {
	display: flex;
	flex-direction: row;
	gap: 1.2rem;
	justify-content: center;
	align-content: center;
	align-items: center;
}

.user-info{
	color: #fff;
	font-size: 1rem;
	font-weight: 500;
	max-width: 50px !important;
	//overflow: scroll;
	overflow-wrap: anywhere;
	white-space: wrap;
}

.vip{
	background: #ffe900;
	padding: 0.2rem 0.6rem;
	border-radius: 0.8rem;
	font-weight: 1000;
	color: goldenrod;
	font-style: italic;
}

.btn {
	position: relative;
	padding: 0.4rem 1.2rem;
	border: none;
	border-radius: 25px;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
	overflow: hidden;
}

.btn:hover{
	border: 2px solid #00bbff;
	background:  #2291b9;
}

.btn-login {
	background-color: transparent;
	color: #fff;
	border: 2px solid rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(5px);
}

.btn-suggest{
	background-color: transparent;
	color: #ffffff;
	border: 2px solid rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(5px);
	font-style: italic;
}

.btn-register {
	background: #1ed760;
	color: #fff;
	border: 2px solid #12d956;
}
</style>
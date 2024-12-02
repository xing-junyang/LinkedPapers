<script setup lang="ts">

</script>

<template>
	<el-header class="header" height="10">
		<el-row :gutter="10">
			<el-col :span="4" class="header-left">
				<router-link to="/" v-slot="{navigate}">
					<h1 class="title" @click="navigate">
						Linked Papers
					</h1>
				</router-link>
			</el-col>
			<el-col :span="16">
			</el-col>
			<el-col :span="4" class="header-right">
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
				<div v-if="hasLogin" class="user-info-container">
					<span class="user-info">欢迎，{{ userName }}</span>
				</div>
				<router-link to="/" v-slot="{navigate}" v-if="hasLogin">
					<button v-if="hasLogin" class="btn btn-login" @click="handleLogout">
						<span>登出</span>
					</button>
				</router-link>
			</el-col>
		</el-row>
	</el-header>
</template>

<style scoped>
.header {
	background: linear-gradient(to right, #2291b9, #1798c7);
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	display: flex;
	flex-direction: column;
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
	display: flex !important;
	flex-direction: row;
	gap: 1.2rem;
	justify-content: center;
	align-content: center;
	align-items: center;

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

.btn-login {
	background-color: transparent;
	color: #fff;
	border: 2px solid rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(5px);
}

.btn-register {
	background: linear-gradient(45deg, #1db954, #1ed760);
	color: #fff;
	box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
}

</style>
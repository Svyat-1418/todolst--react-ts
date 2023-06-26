import { AxiosResponse } from 'axios'
import { instance } from 'common/api/common.api'
import { CommonResponseType } from 'common/types/common.types'

export const authAPI = {
	login(loginParams: LoginParamsType) {
		return instance.post<
			LoginParamsType,
			AxiosResponse<
				CommonResponseType<{
					userId: number
				}>
			>
		>('/auth/login', loginParams)
	},
	logout() {
		return instance.delete<CommonResponseType>('/auth/login')
	},
	me() {
		return instance.get<CommonResponseType<AuthMeResponseType>>('auth/me')
	},
}

export type LoginParamsType = {
	email: string
	password: string
	rememberMe?: boolean
	captcha?: string
}
export type AuthMeResponseType = {
	id: number
	email: string
	login: string
}

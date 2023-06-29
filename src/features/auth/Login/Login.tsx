import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useActions } from 'common/hooks/useActions'
import { CommonResponseType } from 'common/types/common.types'
import { selectIsLoggedIn } from 'features/auth/auth.selectors'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { LoginParamsType } from '../auth.api'
import { authThunks } from '../auth.slice'

import styles from './Login.module.css'

type FormikErrorType = Partial<Omit<LoginParamsType, 'captcha'>>

export const Login = () => {
	const { login } = useActions(authThunks)

	const isLoggedIn = useSelector(selectIsLoggedIn)

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		validate: (values) => {
			const errors: FormikErrorType = {}

			if (!values.email) {
				errors.email = 'Required'
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
				errors.email = 'Invalid email address'
			}

			if (!values.password) {
				errors.password = 'Required'
			} else if (values.password.length < 3) {
				errors.password = 'Min length must be 3'
			}
			return errors
		},
		onSubmit: (values, formikHelpers) => {
			login(values)
				.unwrap()
				.catch((reason: CommonResponseType) => {
					const { fieldsErrors } = reason
					if (fieldsErrors) {
						fieldsErrors.forEach(
							(fieldError: { field: string; error: string | undefined }) => {
								formikHelpers.setFieldError(fieldError.field, fieldError.error)
							}
						)
					}
				})
		},
	})

	if (isLoggedIn) {
		return <Navigate to={'/'} />
	}

	return (
		<Grid container justifyContent={'center'}>
			<Grid item justifyContent={'center'}>
				<form onSubmit={formik.handleSubmit}>
					<FormControl>
						<FormLabel>
							<p>
								To log in get registered
								<a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
									{' '}
									here
								</a>
							</p>
							<p>or use common test account credentials:</p>
							<p>Email: free@samuraijs.com</p>
							<p>Password: free</p>
						</FormLabel>
						<FormGroup>
							<TextField label="Email" margin="normal" {...formik.getFieldProps('email')} />
							{formik.errors.email && formik.touched.email && (
								<div className={styles.fieldError}>{formik.errors.email}</div>
							)}
							<TextField
								type="password"
								label="Password"
								margin="normal"
								{...formik.getFieldProps('password')}
							/>
							{formik.errors.password && formik.touched.password && (
								<div className={styles.fieldError}>{formik.errors.password}</div>
							)}
							<FormControlLabel
								label={'Remember me'}
								control={<Checkbox />}
								{...formik.getFieldProps('rememberMe')}
							/>
							<Button type={'submit'} variant={'contained'} color={'primary'}>
								Login
							</Button>
						</FormGroup>
					</FormControl>
				</form>
			</Grid>
		</Grid>
	)
}

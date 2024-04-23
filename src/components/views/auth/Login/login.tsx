import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { sign } from "crypto";
import { signIn } from "next-auth/react";

const LoginView = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	// const router = useRouter();
	const { push, query } = useRouter();
	const callbackUrl: any = query.callbackUrl || "/";
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");
		const form = event.target as HTMLFormElement;
		try {
			const res = await signIn("credentials", {
				redirect: false,
				email: form.email.value,
				password: form.password.value,
				callbackUrl: Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl,
			});

			if (!res?.error) {
				setIsLoading(false);
				form.reset();
				push(callbackUrl);
			} else {
				setIsLoading(false);
				setError("Email or password is incorrect");
			}
		} catch (error) {
			setIsLoading(false);
			setError("Email or password is incorrect");
		}
	};
	return (
		<div className={styles.login}>
			<h1 className={styles.login__title}>Login</h1>
			{error && <p className={styles.login__error}>{error}</p>}
			<div className={styles.login__form}>
				<form onSubmit={handleSubmit} action="">
					<div className={styles.login__form__item}>
						<label htmlFor="email">Email</label>
						<input name="email" id="email" type="text" className={styles.login__form__input} />
					</div>
					<div className={styles.login__form__item}>
						<label htmlFor="password">Password</label>
						<input name="password" id="password" type="password" className={styles.login__form__input} />
					</div>
					<button type="submit" className={styles.login__button}>
						{isLoading ? "Loading..." : "Login"}
					</button>
				</form>
			</div>
			<p className="{styles.login__link}">
				Don{"'"}t have an account? sign up
				<Link href="/auth/register">here</Link>
			</p>
		</div>
	);
};

export default LoginView;

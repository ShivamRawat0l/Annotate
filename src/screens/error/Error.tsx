import { lazy, Suspense, useEffect, useState } from 'react'
import notFound from "@/assets/lottie/not-found.json"
import { useTheme } from '@/src/theme/ThemeProvider';
import { Colors } from '@/src/theme/colors';
const Lottie = lazy(() => import('lottie-react'));

export const Error = () => {
	const { theme } = useTheme()

	return <Suspense fallback={<h1>Fetching</h1>}>
		<div style={{
			flex: 1,
			display: 'flex',
			height: "100vh",
			justifyContent: "center",
			alignItems: "center",
			alignContent: "center",
			alignSelf: "center",
			background: Colors[theme].secondary
		}}>
			<Lottie animationData={notFound}
				style={{
					flex: 1,
					width: 600,
					height: 600,
					display: 'flex',
					alignSelf: "center",
					justifyContent: "center",
				}}
			/>
		</div >
	</Suspense >
}

import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import { AuthProvider } from '@/context/AuthProvider';
import { useRouter } from 'next/router';

const font = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const currentPath = router.pathname;

	return (
		<div className={font.className}>
			<Head>
				<title>H-Audit</title>
				<link rel='icon' href='/icon.png' type='image/PNG' />
			</Head>

			{currentPath.includes('customer') ? (
				<Component {...pageProps} />
			) : (
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			)}

			<ToastContainer closeOnClick pauseOnFocusLoss={false} />
		</div>
	);
}

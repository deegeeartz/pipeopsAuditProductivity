import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';

const font = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

export default function App({ Component, pageProps }) {
	return (
		<div className={font.className}>
			<Head>
				<title>Audit Pro</title>
				<link rel='icon' href='/icon.png' type='image/PNG' />
			</Head>

			<Component {...pageProps} />

			<ToastContainer
				// position='top-right'
				// autoClose={5000}
				// hideProgressBar={false}
				// newestOnTop={true}
				closeOnClick
				pauseOnFocusLoss={false}
				// draggable
				// pauseOnHover
				// theme='light'
			/>
		</div>
	);
}

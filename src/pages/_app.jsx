import '@/styles/index.css';
import { Poppins } from 'next/font/google';

const font = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

export default function App({ Component, pageProps }) {
	return (
		<div className={font.className}>
			<Component {...pageProps} />
		</div>
	);
}

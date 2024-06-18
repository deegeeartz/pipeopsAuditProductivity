import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { authMiddleware, userIsLoggedIn } from '@/services/auth';

const GuestLayout = ({ children }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		authMiddleware(router, 'guest');
		!userIsLoggedIn() && setLoading(false);
	}, []);

	return (
		<>
			<Head>
				<title>Bespoke Audits</title>
			</Head>

			{!loading && <main>{children}</main>}
		</>
	);
};

export default GuestLayout;

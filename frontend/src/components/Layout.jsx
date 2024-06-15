import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
	RiArrowDropRightLine,
	RiBook2Line,
	RiHome4Line,
	RiMenuLine,
	RiUserSearchLine,
	RiUserStarLine,
} from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';

const Layout = ({ children }) => {
	const router = useRouter();
	const { pathname } = router;
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			// If already in fullscreen, exit fullscreen
			document.exitFullscreen();
		} else {
			// If not in fullscreen, request fullscreen
			document.documentElement.requestFullscreen();
		}
	}

	const getHeaderText = () => {
		const breadcrumb = pathname.split('/').filter(Boolean); // Filter out empty strings
		return breadcrumb;
	};

	return (
		<>
			<Head>
				<title>Bespoke Audits</title>
				<link rel='icon' href='/icon.png' type='image/PNG' />
			</Head>

			<div
				className={`fixed md:-translate-x-0 left-0 top-0 w-64 h-full bg-[#fff] p-4 z-50 transition-transform border-r border-gray-200 ${
					sidebarOpen ? '-translate-x-0' : '-translate-x-full'
				}`}>
				<Link href='/admin' className='flex items-center pb-5'>
					<img src='/logo.png' alt='Logo' className='w-[80px] mx-auto' />
				</Link>

				<ul className='mt-4'>
					<li className='mb-1 group'>
						<Link
							href='/admin'
							className='pl-2 flex font-semibold items-center py-3 text-gray-900 hover:bg-[#252525] hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white'>
							<RiHome4Line className='mr-3 text-lg' />
							<span className='text-sm'>Dashboard</span>
						</Link>
					</li>

					<li className='mb-1 group'>
						<Link
							href='/admin/surveys'
							className='pl-2 flex font-semibold items-center py-3 text-gray-900 hover:bg-[#252525] hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white'>
							<RiBook2Line className='mr-3 text-lg' />
							<span className='text-sm'>Manage Surveys</span>
						</Link>
					</li>

					<li className='mb-1 group'>
						<Link
							href=''
							className='pl-2 flex font-semibold items-center py-3 text-gray-900 hover:bg-[#252525] hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white'>
							<RiUserStarLine className='mr-3 text-lg' />
							<span className='text-sm'>Manage Clients</span>
						</Link>
					</li>

					<li className='mb-1 group'>
						<Link
							href=''
							className='pl-2 flex font-semibold items-center py-3 text-gray-900 hover:bg-[#252525] hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white'>
							<RiUserSearchLine className='mr-3 text-lg' />
							<span className='text-sm'>Manage Inspectors</span>
							<i className='ri-arrow-right-s-line ml-auto group-[.selected]:rotate-90' />
						</Link>
					</li>
				</ul>
			</div>

			<div
				className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden ${
					sidebarOpen ? '' : 'hidden'
				}`}
				onClick={toggleSidebar}
			/>

			<main
				className={`w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-100 min-h-screen transition-all main`}>
				<div className='py-4 px-6 bg-[#fff] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30'>
					<button
						type='button'
						className='text-lg text-gray-900 font-semibold sidebar-toggle md:hidden'
						onClick={toggleSidebar}>
						<RiMenuLine />
					</button>

					<ol className='ms-4 md:ms-0 flex items-center whitespace-nowrap capitalize'>
						<li className='text-sm text-gray-600'>{getHeaderText()[0]}</li>
						<RiArrowDropRightLine className='text-sm text-gray-600' />
						<li className='text-sm font-semibold text-gray-600 truncate' aria-current='page'>
							{getHeaderText()[1] ?? 'Dashboard'}
						</li>
					</ol>

					<ul className='ml-auto flex items-center'>
						<button id='fullscreen-button' onClick={toggleFullscreen}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width={24}
								height={24}
								className='hover:bg-gray-100 rounded-full'
								viewBox='0 0 24 24'
								style={{ fill: 'gray', transform: '', msfilter: '' }}>
								<path d='M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z' />
							</svg>
						</button>

						<li className='dropdown ml-6'>
							<button type='button' className='dropdown-toggle flex items-center'>
								<FaUserCircle size={24} color='#252525' />
							</button>
						</li>
					</ul>
				</div>

				{children}
			</main>
		</>
	);
};

export default Layout;
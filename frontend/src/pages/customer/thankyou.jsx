import React from 'react';

const thankyou = () => {
	return (
		<main className={`w-full bg-gray-100 min-h-screen transition-all main`}>
			{/* HEADER */}
			<div className='py-4 px-6 bg-[#fff] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30'>
				<Link href='/' className='flex items-center'>
					<img src='/logo.png' alt='Logo' className='w-[90px] mx-auto' />
				</Link>

				<ul className='ml-auto flex items-center'>
					<button
						id='fullscreen-button'
						className='hover:bg-gray-100 p-1 rounded-full'
						onClick={toggleFullscreen}>
						<svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
							<path d='M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z' />
						</svg>
					</button>
				</ul>
			</div>

			<div className='container mx-auto'>
				<div className='content p-6'>
					<div className='mb-7 flex justify-between items-center'>
						<h1 className='font-bold text-lg text-[#222]'>Thank You</h1>
					</div>

					<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
						{/*  */}
					</div>
				</div>
			</div>
		</main>
	);
};

export default thankyou;

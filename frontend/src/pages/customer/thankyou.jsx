import Link from 'next/link';
import React from 'react';

const Thankyou = () => {
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

			<div className='container mx-auto h-[80vh] fx_center'>
				<div className='bg-white p-6  md:mx-auto'>
					<svg viewBox='0 0 24 24' className='text-green-600 w-16 h-16 mx-auto my-6'>
						<path
							fill='currentColor'
							d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'></path>
					</svg>
					<div className='text-center'>
						<h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>Done!</h3>
						<p className='text-gray-600 my-2'>Thank you for completing this survey.</p>
						<p> Have a great day!</p>

						{/* <div className='py-10 text-center'>
									<a
										href='#'
										className='px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3'>
										GO BACK
									</a>
								</div> */}
					</div>
				</div>
			</div>
		</main>
	);
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

export default Thankyou;

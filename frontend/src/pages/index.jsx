export default function Home() {
	return (
		<main>
			<div className='h-screen flex flex-col md:flex-row'>
				<div
					className='flex h-1/2 md:w-1/2 md:h-full justify-around items-center'
					style={{ background: 'linear-gradient(112.1deg, rgb(14, 50, 108) 11.4%, #20242f 70.2%)' }}>
					<div className='container mx-auto p-6 md:w-3/4 text-center'>
						<img src='/logo-xl.png' alt='' className='w-[150px] md:w-[170px] mb-5 mx-auto' />
						{/* <h1 className='text-white font-bold text-4xl font-sans mb-4'>Bespoke audits</h1> */}
					</div>
				</div>

				<div className='flex min-h-[60vh] md:w-1/2 justify-center items-center bg-white'>
					<form className='container mx-auto p-6 w-3/4 min-w-[350px] bg-white'>
						<h1 className='text-gray-800 font-bold text-2xl mb-6'>Welcome Back!</h1>

						<div className='flex flex-col mb-5'>
							<label className='font-medium text-sm mb-1.5' htmlFor=''>
								Email Address
							</label>

							<input
								className='px-3 border-2 py-[7px] rounded-md placeholder:text-[13px]'
								type='text'
								id='email'
								placeholder='Enter your email'
							/>
						</div>

						<div className='flex flex-col mb-5'>
							<label className='font-medium text-sm mb-1.5' htmlFor=''>
								Password
							</label>

							<input
								className='px-3 border-2 py-[7px] rounded-md placeholder:text-[13px]'
								type='text'
								id='password'
								placeholder='Enter your password'
							/>
						</div>

						<button
							type='submit'
							className='block w-full py-2 rounded-md text-white font-semibold mb-2'
							style={{ background: '#142d58' }}>
							Login
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}

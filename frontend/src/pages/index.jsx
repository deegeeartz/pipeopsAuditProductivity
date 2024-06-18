import { useRouter } from 'next/router';

export default function Login() {
	const router = useRouter();

	const onFormSubmit = (el) => {
		el.preventDefault();

		router.push('/admin');
	};

	return (
		<main>
			<div className='flex min-h-full flex-col justify-center p-5 pt-2 pb-8 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
					<img src='/logo-xl.png' alt='Logo' className='w-[150px] mx-auto' />
				</div>

				<div class='mx-auto w-full max-w-[440px] py-6 px-4 md:px-8 bg-white border border-gray-200 rounded-xl shadow-lg'>
					<h2 className='mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
						Sign in to your account
					</h2>

					<div className='mt-10 mb-5 w-full'>
						<form className='space-y-6' onSubmit={onFormSubmit}>
							<div>
								<label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
									Email address
								</label>
								<div className='mt-2'>
									<input
										id='email'
										name='email'
										type='email'
										autoComplete='email'
										required
										className='block w-full rounded-md border border-gray-400 py-2 text-gray-900 placeholder:text-gray-400 !ring-0 focus:border-[#252525] sm:text-sm sm:leading-6'
									/>
								</div>
							</div>

							<div>
								<div className='flex items-center justify-between'>
									<label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
										Password
									</label>

									{/* <div className='text-sm'>
									<a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
										Forgot password?
									</a>
								</div> */}
								</div>

								<div className='mt-2'>
									<input
										id='password'
										name='password'
										type='password'
										autoComplete='current-password'
										required
										className='block w-full rounded-md border border-gray-400 py-2 text-gray-900 placeholder:text-gray-400 !ring-0 focus:border-[#252525] sm:text-sm sm:leading-6'
									/>
								</div>
							</div>

							<div>
								<button
									type='submit'
									className='flex w-full justify-center rounded-md bg-[#252525] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90'>
									Sign in
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}

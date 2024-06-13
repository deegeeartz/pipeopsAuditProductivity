import Layout from '@/components/Layout';

const AdminDashboard = () => {
	return (
		<Layout>
			<div className='content p-6'>
				<h1 className='font-bold mb-6 text-lg text-[#222]'>Admin Dashbord</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
					<div className='bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5'>
						<div className='flex justify-between mb-6'>
							<div>
								<div className='flex items-center mb-1'>
									<div className='text-2xl font-semibold'>12</div>
								</div>
								<div className='text-sm font-medium text-gray-400'>Surveys</div>
							</div>
						</div>
						<a href='/gebruikers' className='text-[#202639] font-medium text-sm hover:text-blue-900'>
							View
						</a>
					</div>

					<div className='bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5'>
						<div className='flex justify-between mb-6'>
							<div>
								<div className='flex items-center mb-1'>
									<div className='text-2xl font-semibold'>14</div>
								</div>
								<div className='text-sm font-medium text-gray-400'>Clients</div>
							</div>
						</div>
						<a href='/dierenartsen' className='text-[#202639] font-medium text-sm hover:text-blue-900'>
							View
						</a>
					</div>

					<div className='bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5'>
						<div className='flex justify-between mb-6'>
							<div>
								<div className='text-2xl font-semibold mb-1'>10</div>
								<div className='text-sm font-medium text-gray-400'>Inspectors</div>
							</div>
						</div>
						<a href className='text-[#202639] font-medium text-sm hover:text-blue-900'>
							View
						</a>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default AdminDashboard;
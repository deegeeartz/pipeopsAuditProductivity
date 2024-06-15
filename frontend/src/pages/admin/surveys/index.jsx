import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

const SurveyTable = dynamic(() => import('@/components/SurveyTable'), { ssr: false });

const Surveys = () => {
	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-6 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Manage Surveys</h1>
					<a className='btn_primary'>Create new</a>
				</div>

				<div className='py-1 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<div className='py-3 px-4 flex justify-between items-center'>
						<p className='text-[13px] font-semibold'>Total (2)</p>
						<div></div>
						<input
							type='text'
							className='border border-gray-300 rounded-[4px] h-7 w-[200px] p-2 text-sm placeholder:text-[12px]'
							placeholder='Search...'
						/>
					</div>

					<SurveyTable />
				</div>
			</div>
		</Layout>
	);
};

export default Surveys;
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import Layout from '@/components/Layout';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';
import { RiAddFill } from 'react-icons/ri';

const SurveyTable = dynamic(() => import('@/components/SurveyTable'), { ssr: false, loading: Loader });

const Surveys = () => {
	const [openDelModal, setOpenDelModal] = useState(false);

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Manage Surveys</h1>
					<a className='btn_primary _flex'>
						<RiAddFill className='mr-2 h-5 w-5' />
						Create New
					</a>
				</div>

				<div className='py-1 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<div className='py-3 px-4 flex justify-between items-center'>
						<p className='text-[13px] font-semibold'>Total (4)</p>
						<div></div>
						<input
							type='text'
							className='border border-gray-300 rounded-[4px] h-7 w-[200px] p-2 text-sm placeholder:text-[12px]'
							placeholder='Search...'
						/>
					</div>

					<SurveyTable setOpenDelModal={setOpenDelModal} />
				</div>
			</div>

			{openDelModal && <DeleteModal openModal={openDelModal} setOpenModal={setOpenDelModal} />}
		</Layout>
	);
};

export default Surveys;
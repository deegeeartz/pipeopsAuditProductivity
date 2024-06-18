import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import Layout from '@/components/Layout';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';
import { RiAddFill } from 'react-icons/ri';
import Link from 'next/link';
import { Modal } from 'flowbite-react';

const SurveyTable = dynamic(() => import('@/components/SurveyTable'), { ssr: false, loading: Loader });

const Surveys = () => {
	const [openDelModal, setOpenDelModal] = useState(false);
	const [entryModal, setEntryModal] = useState(false);

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Manage Surveys</h1>
					<Link href='/admin/surveys/create' className='btn_primary _flex'>
						<RiAddFill className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>Create New</span>
					</Link>
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

					<SurveyTable setOpenDelModal={setOpenDelModal} setEntryModal={setEntryModal} />
				</div>
			</div>

			{openDelModal && <DeleteModal openModal={openDelModal} setOpenModal={setOpenDelModal} />}
			{entryModal && <EntriesModal openModal={entryModal} setOpenModal={setEntryModal} />}
		</Layout>
	);
};

const EntriesModal = ({ openModal, setOpenModal, data }) => {
	return (
		<>
			<Modal dismissible position={'center'} show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>List Of Entries</Modal.Header>

				<Modal.Body>
					<div className='space-y-6'>
						<div>
							<div className='card mb-4 grid gap-3 md:flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg '>
								<span className='pr-2'>
									<b>#1</b>
								</span>
								<span className='pr-2'>
									<b>Inspector:</b> Mr. David
								</span>
								<span className='pr-2'>
									<b>Date:</b> April 18, 2024
								</span>
								<Link href={'#'} className='btn_primary px-4'>
									View
								</Link>
							</div>

							<div className='card mb-4 grid gap-3 md:flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg '>
								<span className='pr-2'>
									<b>#2</b>
								</span>
								<span className='pr-2'>
									<b>Inspector:</b> Mr. David
								</span>
								<span className='pr-2'>
									<b>Date:</b> April 18, 2024
								</span>
								<Link href={'#'} className='btn_primary px-4'>
									View
								</Link>
							</div>

							<div className='card mb-4 grid gap-3 md:flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg '>
								<span className='pr-2'>
									<b>#3</b>
								</span>
								<span className='pr-2'>
									<b>Inspector:</b> Mr. David
								</span>
								<span className='pr-2'>
									<b>Date:</b> April 18, 2024
								</span>
								<Link href={'#'} className='btn_primary px-4'>
									View
								</Link>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default Surveys;

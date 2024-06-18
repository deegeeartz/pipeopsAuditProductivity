import { CategoryModal } from '@/components/CategoryModal';
import Layout from '@/components/Layout';
import { Loader } from '@/components/Loader';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { RiAddFill, RiDeleteBin4Fill, RiEdit2Fill } from 'react-icons/ri';

const DataTableX = dynamic(() => import('@/components/DataTableX'), { ssr: false, loading: Loader });

const Settings = () => {
	const [openModal, setOpenModal] = useState({ open: false, type: 'create' });
	const [openDelModal, setOpenDelModal] = useState(false);

	const ActionButtons = ({ id }) => {
		const style =
			'text-[17px] cursor-pointer rounded-sm p-1 text-[#252525] border border-gray-300 hover:bg-gray-200';
		return (
			<div className='flex gap-x-2'>
				<div className={`${style}`} onClick={() => setOpenModal({ open: true, type: 'edit' })}>
					<RiEdit2Fill />
				</div>
				<div className={`${style}`} onClick={() => setOpenDelModal(true)}>
					<RiDeleteBin4Fill />
				</div>
			</div>
		);
	};

	const columns = [
		{
			name: 'ID',
			selector: (row) => '#' + Math.floor(Math.random() * 9999) + 'C',
			sortable: true,
			minWidth: '20px',
			maxWidth: '160px',
		},
		{
			name: 'Title',
			selector: (row) => 'Arrival and check in - General',
			sortable: true,
			minWidth: '50%',
		},

		{
			name: 'Action',
			maxWidth: '160px',
			cell: (row) => <ActionButtons id={row.title} />,
		},
	];

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Settings</h1>
					<button onClick={() => setOpenModal({ open: true, type: 'create' })} className='btn_primary _flex'>
						<RiAddFill className='mr-2 h-5 w-5' />
						Add Category
					</button>
				</div>

				<div className='py-1 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<div className='py-3 px-4 flex justify-between items-center'>
						<p className='text-[13px] font-semibold'>Category (4)</p>
						<div></div>
						<input
							type='text'
							className='border border-gray-300 rounded-[4px] h-7 w-[200px] p-2 text-sm placeholder:text-[12px]'
							placeholder='Search...'
						/>
					</div>

					<DataTableX columns={columns} />
				</div>
			</div>

			{openModal.open && <CategoryModal openModal={openModal} setOpenModal={setOpenModal} />}
			{openDelModal && <DeleteModal openModal={openDelModal} setOpenModal={setOpenDelModal} />}
		</Layout>
	);
};

function DeleteModal({ openModal, setOpenModal, deleteFunc }) {
	return (
		<>
			<Modal dismissible show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
				<Modal.Header />

				<Modal.Body>
					<div className='text-center'>
						<FaExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
						<h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
							Are you sure you want to delete this item?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={() => setOpenModal(false)}>
								{"Yes, I'm sure"}
							</Button>
							<Button color='gray' onClick={() => setOpenModal(false)}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Settings;

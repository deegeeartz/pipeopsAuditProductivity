import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import DeleteModal from '@/components/DeleteModal';
import { Loader } from '@/components/Loader';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { FaExclamationCircle } from 'react-icons/fa';
import { RiAddFill, RiDeleteBin4Fill, RiEdit2Fill } from 'react-icons/ri';

const DataTableX = dynamic(() => import('@/components/DataTableX'), { ssr: false, loading: Loader });

const Clients = () => {
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
			selector: (row) => '#0528',
			sortable: true,
			minWidth: '0px',
		},
		{
			name: 'Name',
			selector: (row) => 'GSmith Ltd',
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Email',
			selector: (row) => 'dytech.studio@gmail.com',
			sortable: true,
			minWidth: '210px',
		},
		{
			name: 'Passcode',
			sortable: true,
			minWidth: '120px',
			cell: (row) => {
				let passcode = row.title_ ?? 'Mike55115b';
				return (
					<div
						onClick={() => {
							// console.log(row.title);
							alert('Passcode: ' + passcode);
						}}>
						{<p>********</p>}
					</div>
				);
			},
		},
		{
			name: 'Date Added',
			selector: (row) => row.date,
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Action',
			minWidth: '150px',
			cell: (row) => <ActionButtons id={row.title} />,
		},
	];

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Manage Clients</h1>

					<button onClick={() => setOpenModal({ open: true, type: 'create' })} className='btn_primary _flex'>
						<RiAddFill className='mr-2 h-5 w-5' />
						Create New
					</button>
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

					<DataTableX columns={columns} />
				</div>
			</div>

			{openModal.open && <CustomModal openModal={openModal} setOpenModal={setOpenModal} />}
			{openDelModal && <DeleteModal openModal={openDelModal} setOpenModal={setOpenDelModal} />}
		</Layout>
	);
};

function CustomModal({ openModal, setOpenModal }) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [passcode, setPasscode] = useState('');

	const isEdit = openModal.type === 'edit';

	useEffect(() => {
		const setField = () => {
			setName('Test User');
			setEmail('dycodes51@gmail.com');
			setPasscode('hello25653');
		};

		isEdit && setField();
	}, []);

	return (
		<>
			<Modal dismissible show={openModal.open} onClose={() => setOpenModal({ ...openModal, open: false })}>
				<Modal.Header>{isEdit ? 'Edit Client' : 'Create New Client'}</Modal.Header>

				<Modal.Body>
					<div className='space-y-6'>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='name' value='Name' />
							</div>
							<TextInput id='name' value={name} onChange={(e) => setName(e.target.value)} required />
						</div>

						<div>
							<div className='mb-2 block'>
								<Label htmlFor='email' value='Email Address' />
							</div>
							<TextInput
								id='email'
								placeholder='name@company.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div>
							<div className='mb-2 block'>
								<Label htmlFor='passcode' value='Passcode' />
							</div>
							<TextInput
								id='passcode'
								type={isEdit ? 'text' : 'password'}
								value={passcode}
								onChange={(e) => setPasscode(e.target.value)}
								required
							/>
						</div>

						<div className='w-full'>
							<button className='btn_primary px-8 w-36'>{isEdit ? 'Update' : 'Create'}</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Clients;

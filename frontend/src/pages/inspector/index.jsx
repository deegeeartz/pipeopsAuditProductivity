import { useState } from 'react';
import Layout from '@/components/Layout';
import DeleteModal from '@/components/DeleteModal';
import { Loader } from '@/components/Loader';
import { Badge } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { RiEditLine, RiEyeFill, RiPlayLine } from 'react-icons/ri';
import Link from 'next/link';

const DataTableX = dynamic(() => import('@/components/DataTableX'), { ssr: false, loading: Loader });

const InspectorAudits = () => {
	const [openDelModal, setOpenDelModal] = useState(false);

	const ActionButtons = ({ id }) => {
		const style =
			'text-[17px] cursor-pointer rounded-sm p-1 text-[#252525] border border-gray-300 hover:bg-gray-200 fx_center';
		return (
			<div className='flex gap-x-4'>
				{/* <Link href={'#'} className={`${style}`}>
					<RiEyeFill />
				</Link> */}

				<Link href={'#'}>
					<button className='btn_primary fx_center w-[115px] !p-3 !py-1.5'>
						<RiEditLine className='mr-1.5 h-5 w-5' />
						Edit
					</button>
				</Link>
			</div>
		);
	};

	const columns = [
		{
			name: 'ID',
			selector: (row) => '#4655',
			sortable: true,
			minWidth: '0px',
		},
		{
			name: 'Client',
			selector: (row) => 'GSmith Ltd',
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Brand',
			selector: (row) => 'GSmith Hostel NG',
			sortable: true,
			minWidth: true,
			minWidth: '110px',
		},
		{
			name: 'Campaign',
			selector: (row) => '1st round 2023',
			sortable: true,
			minWidth: '120px',
			hide: 'md',
		},
		{
			name: 'Start Date',
			selector: (row) => row.date,
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'End Date',
			selector: (row) => row.date,
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Expenditure',
			selector: (row) => (
				<Badge color={!row.date ? 'success' : 'failure'} className='cursor-pointer'>
					{/* Uploaded */}
					N/A
				</Badge>
			),
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Filled',
			minWidth: '120px',
			cell: () => {
				const count = 1;
				return (
					<Badge color={count > 0 ? 'success' : 'warning'} className='cursor-pointer'>
						Completed
					</Badge>
				);
			},
		},
		{
			name: 'Feedback',
			minWidth: '120px',
			cell: () => {
				const count = 8;
				return (
					<Badge color={'info'} className='cursor-pointer'>
						{count}
					</Badge>
				);
			},
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
					<h1 className='font-bold text-lg text-[#222]'>My Audits</h1>
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

			{openDelModal && <DeleteModal openModal={openDelModal} setOpenModal={setOpenDelModal} />}
		</Layout>
	);
};

export default InspectorAudits;

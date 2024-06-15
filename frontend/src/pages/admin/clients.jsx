import Layout from '@/components/Layout';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';
import { RiAddFill, RiDeleteBin2Fill, RiEdit2Fill, RiEyeFill } from 'react-icons/ri';

const DataTableX = dynamic(() => import('@/components/DataTableX'), { ssr: false, loading: Loader });

const Clients = () => {
	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Manage Clients</h1>
					<a className='btn_primary _flex'>
						<RiAddFill className='mr-2 h-5 w-5' />
						Create New
					</a>
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

					<DataTableX columns={columns} />
				</div>
			</div>
		</Layout>
	);
};

const ActionButtons = ({ id }) => {
	const style = 'text-white text-[17px] cursor-pointer rounded-sm p-1 text-[#252525] border border-gray-300';
	return (
		<div className='flex gap-x-2'>
			<div className={`${style} `}>
				<RiEyeFill />
			</div>
			<div className={`${style} `}>
				<RiEdit2Fill />
			</div>
			<div className={`${style} `}>
				<RiDeleteBin2Fill />
			</div>
		</div>
	);
};

const columns = [
	{
		name: 'ID',
		selector: (row) => '4655',
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
			let passcode = row.title;
			return (
				<div
					onClick={() => {
						console.log(row.title);
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

export default Clients;
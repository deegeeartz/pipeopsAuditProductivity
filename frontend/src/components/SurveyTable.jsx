import { Badge } from 'flowbite-react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { RiDeleteBin4Fill, RiEdit2Fill, RiEyeFill } from 'react-icons/ri';

const SurveyTable = ({ setOpenDelModal, setEntryModal }) => {
	const customStyles = {
		rows: {
			style: {
				minHeight: '62px', // override the row height
			},
		},
		headCells: {
			style: {},
		},
		cells: {
			style: {},
		},
	};

	const ActionButtons = ({ id }) => {
		const style =
			'text-[17px] cursor-pointer rounded-sm p-1 text-[#252525] border border-gray-300 hover:bg-gray-200';
		return (
			<div className='flex gap-x-2.5'>
				<Link href={'#'} className={`${style}`}>
					<RiEyeFill />
				</Link>
				<Link href={'surveys/4655/edit'} className={`${style}`}>
					<RiEdit2Fill />
				</Link>
				<div className={`${style}`} onClick={() => setOpenDelModal(true)}>
					<RiDeleteBin4Fill />
				</div>
			</div>
		);
	};

	const columns = [
		{
			name: 'Audit ID',
			selector: (row) => '4655',
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
			name: 'Status',
			minWidth: '120px',
			cell: () => {
				const count = 3;
				return (
					<Badge
						color={count > 0 ? 'success' : 'failure'}
						onClick={() => setEntryModal(true)}
						className='cursor-pointer'>
						{count}
						{count > 1 ? ' Entries' : ' Entry'}
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
		<DataTable
			className='datatable'
			columns={columns}
			data={data}
			pagination
			// expandableRows={true}
			// expandableRowsComponent={ExpandedComponent}
			// expandOnRowClicked={true}
			customStyles={customStyles}
		/>
	);
};

const data = [
	{
		id: 1,
		title: 'Beetlejuice',
		date: '12 Mar, 2024',
		director: 'Hello Wrld',
	},
	{
		id: 2,
		title: 'Ghostbusters',
		date: '12 Mar, 2024',
		director: 'Hello Wrld',
	},
	{
		id: 12,
		title: 'Beetlejuice',
		date: '12 Mar, 2024',
		director: 'Hello Wrld',
	},
	{
		id: 13,
		title: 'Beetlejuice',
		date: '12 Mar, 2024',
		director: 'Hello Wrld',
	},
];

export default SurveyTable;

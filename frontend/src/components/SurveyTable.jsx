import { Badge } from 'flowbite-react';
import DataTable from 'react-data-table-component';

const SurveyTable = () => {
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
		name: 'Executive Summary',
		minWidth: '120px',
		cell: () => {
			return <Badge color='success'>Completed</Badge>;
		},
	},
	{
		name: 'Action',
		minWidth: '150px',
		cell: () => {
			const style = 'text-white text-[12px] rounded-sm p-1 px-2';
			return (
				<div className='flex'>
					<div className={`${style} bg-[#252525] mr-1.5`}>Edit</div>
					<div className={`${style} bg-red-700 text-white`}>Delete</div>
				</div>
			);
		},
	},
];

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
import DataTable from 'react-data-table-component';

const ExpandedComponent = ({ data }) => {
	return (
		<p className='p-3 px-6'>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</p>
	);
};

const SurveyTable = () => {
	return (
		<DataTable
			className='datatable'
			columns={columns}
			data={data}
			pagination={true}
			expandableRows={true}
			expandableRowsComponent={ExpandedComponent}
			expandOnRowClicked={true}
		/>
	);
};

const columns = [
	{
		name: 'Audit ID',
		selector: (row) => '4655',
		sortable: true,
	},
	{
		name: 'Client',
		selector: (row) => 'GSmith Ltd',
		sortable: true,
	},
	{
		name: 'Brand',
		selector: (row) => 'GSmith Hostel NG',
		sortable: true,
		minWidth: true,
	},
	{
		name: 'Campaign',
		selector: (row) => '1st round 2023',
		sortable: true,
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
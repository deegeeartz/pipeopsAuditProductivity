import DataTable from 'react-data-table-component';

const DataTableX = ({ columns }) => {
	const customStyles = {
		rows: {
			style: {
				minHeight: '62px',
			},
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

export default DataTableX;

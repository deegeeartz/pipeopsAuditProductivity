import { useEffect, useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import Layout from '@/components/layout/DashboardLayout';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';
import { RiAddFill, RiDeleteBin4Fill, RiEdit2Fill, RiEyeFill, RiPlayLine } from 'react-icons/ri';
import Link from 'next/link';
import http from '@/config/axios';
import { errorHandler } from '@/utils/errorHandler';
import SearchBox from '@/components/SearchBox';
import { Badge } from 'flowbite-react';

const DataTableX = dynamic(() => import('@/components/DataTableX'), { ssr: false, loading: Loader });

const InspectorSurveys = () => {
	const [data, setData] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	const fetchData = async () => {
		try {
			const res = await http.get('/survey');
			if (res?.status == 200) {
				console.log(res.data);
				setData(res.data.result);
			}
		} catch (error) {
			errorHandler(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className='h-screen grid items-center'>
				<Loader />
			</div>
		);
	}

	const ActionButtons = ({ id }) => {
		const style =
			'text-[17px] cursor-pointer rounded-sm p-1 text-[#252525] border border-gray-300 hover:bg-gray-200 fx_center';
		return (
			<div className='flex gap-x-4'>
				<Link href={'/audit/' + id}>
					<button className='btn_primary fx_center w-[100px] !p-1 !py-1.5'>
						<RiPlayLine className='mr-1.5 h-[18px] w-[18px]' />
						<span className='text-[13px]'>Start</span>
					</button>
				</Link>
			</div>
		);
	};

	const columns = [
		{
			name: 'ID',
			selector: (row) => '#' + row.id,
			sortable: true,
			minWidth: '0px',
		},
		{
			name: 'Client',
			selector: (row) => row.clientName,
			sortable: true,
			minWidth: '110px',
		},
		{
			name: 'Hotel',
			selector: (row) => row.hotelName,
			sortable: true,
			minWidth: true,
			minWidth: '120px',
		},
		{
			name: 'Campaign',
			selector: (row) => row.campaign,
			sortable: true,
			minWidth: '120px',
			hide: 'md',
		},
		{
			name: 'Start Date',
			selector: (row) => (row?.startDate ? new Date(row?.startDate).toDateString() : '---'),
			sortable: true,
			minWidth: '125px',
		},
		{
			name: 'End Date',
			selector: (row) => (row?.endDate ? new Date(row?.endDate).toDateString() : '---'),
			sortable: true,
			minWidth: '125px',
		},
		{
			name: 'Audits',
			minWidth: '120px',
			cell: (row) => {
				const count = row?._count?.audits;
				return (
					<Badge color={count > 0 ? 'success' : 'failure'} className='cursor-pointer'>
						{count} {count > 1 ? ' Entries' : ' Entry'}
					</Badge>
				);
			},
		},
		{
			name: 'Action',
			minWidth: '150px',
			cell: (row) => <ActionButtons id={row.id} />,
		},
	];

	const searchRecord = async (keyword) => {
		setSearchTerm(keyword);
		try {
			// Limit the length of the search term to reduce api calls
			if (keyword.length > 2) {
				const res = await http.get(`/survey?search=${keyword}`);
				if (res?.status == 200) {
					setData(res.data.result);
				}
			}
			// Re-fetch table data if empty
			keyword.length == 0 && fetchData();
		} catch (error) {
			setData([]);
			errorHandler(error);
		}
	};

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Surveys</h1>
				</div>

				<div className='py-1 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<div className='tableHeader py-3 px-4 flex justify-between items-center'>
						<p className='text-[13px] font-semibold'>Total ({data.length})</p>

						<SearchBox searchTerm={searchTerm} searchRecord={searchRecord} />
					</div>

					<DataTableX data={data} columns={columns} />
				</div>
			</div>
		</Layout>
	);
};

export default InspectorSurveys;

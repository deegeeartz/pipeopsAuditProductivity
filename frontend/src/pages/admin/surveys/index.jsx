import { useEffect, useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import Layout from '@/components/layout/DashboardLayout';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';
import { RiAddFill } from 'react-icons/ri';
import Link from 'next/link';
import { Modal } from 'flowbite-react';
import http from '@/config/axios';
import { errorHandler } from '@/utils/errorHandler';
import SearchBox from '@/components/SearchBox';
import { toast } from 'react-toastify';

const SurveyTable = dynamic(() => import('@/components/survey/SurveyTable'), { ssr: false, loading: Loader });

const Surveys = () => {
	const [openDelModal, setOpenDelModal] = useState({ open: false, data: null });
	const [entryModal, setEntryModal] = useState(false);
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

	const deleteRecord = async () => {
		try {
			const id = openDelModal?.id;
			const res = await http.delete('/survey/' + id);
			if (res?.status == 200) {
				fetchData();
				toast.success(res.data.message);
			}
		} catch (error) {
			errorHandler(error);
		}
	};

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
					<div className='tableHeader py-3 px-4 flex justify-between items-center'>
						<p className='text-[13px] font-semibold'>Total ({data.length})</p>

						<SearchBox searchTerm={searchTerm} searchRecord={searchRecord} />
					</div>

					<SurveyTable data={data} setOpenDelModal={setOpenDelModal} setEntryModal={setEntryModal} />
				</div>
			</div>

			{openDelModal.open && (
				<DeleteModal
					openModal={openDelModal.open}
					setOpenModal={setOpenDelModal}
					deleteRecord={deleteRecord}
				/>
			)}
			{entryModal && <EntriesModal openModal={entryModal} setOpenModal={setEntryModal} data={data} />}
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

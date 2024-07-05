import { Modal } from 'flowbite-react';
import { useState } from 'react';
import UploadWidget from './audit/UploadWidget';
import { FloatField } from './Fields';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import Link from 'next/link';
import { toast } from 'react-toastify';
import http from '@/config/axios';

export const UploadsModal = ({ openModal, setOpenModal, updateState, audit, survey, viewOnly }) => {
	const data = openModal.data;
	const [files, setFiles] = useState(data?.files || []);

	// Get file name based on the data
	let fileName = `${data.category} Q${data.index}`;
	if (audit?.id) fileName = `A${audit.id}_${audit.survey.hotelName}_${data.id}`;
	if (survey?.id) fileName = `S${survey.id}_${survey.hotelName}_${data.id}`;

	const [newFile, setNewFile] = useState({
		id: '',
		public_id: '',
		desc: `${data.title}`,
		name: fileName,
		url: '',
	});

	const action = (el) => {
		el.preventDefault();
		console.log(files);

		if (!newFile.desc || !newFile.url) {
			return toast.error('Description and file is required!');
		}

		// Add to files list
		const updatedFiles = [...files, { ...newFile, id: Date.now() }];
		setFiles(updatedFiles);
		updateState((prev) => ({ ...prev, [data.id]: updatedFiles }));
		// Reset
		setNewFile({ id: '', desc: '', url: '' });
	};

	const removeFile = async (public_id) => {
		// console.log(public_id);
		await deleteFileFromCloudinary(public_id);

		const updatedFiles = files.filter((file) => file.public_id !== public_id);
		setFiles(updatedFiles);
		updateState((prev) => ({ ...prev, [data.id]: updatedFiles }));
	};

	return (
		<>
			<Modal
				dismissible={viewOnly && !data?.canEdit}
				show={openModal.open}
				onClose={() => setOpenModal({ open: false })}>
				<Modal.Header>Upload file</Modal.Header>

				<Modal.Body>
					<form onSubmit={action} className='space-y-4'>
						{!files.length && <p>No files uploaded</p>}

						<div className='list pb-2'>
							{files.map((file, index) => (
								<div
									key={index}
									className='card mb-4 grid gap-3 md:flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg '>
									<span className='pr-3'>
										<b>#{index + 1}</b>
									</span>

									<span className='w-full pr-2 '>
										<b>Description:</b> {file.desc}
									</span>

									<Link
										href={file.url || '#'}
										target={file.url && '_blank'}
										className='btn_primary w-[100px]'>
										View
									</Link>

									{(!viewOnly || data?.canEdit) && (
										<div
											className='btn_primary !py-[8px] w-fit cursor-pointer'
											onClick={() => removeFile(file.public_id)}>
											<RiDeleteBin4Fill className='text-[18px] text-red-400' />
										</div>
									)}
								</div>
							))}
						</div>

						{(!viewOnly || data?.canEdit) && (
							<div className='addNew md:flex gap-x-3'>
								<div className='w-full mb-3 md:mb-[-6px]'>
									<FloatField
										label={'File Description'}
										value={newFile?.desc || ''}
										onChange={(el) => setNewFile({ ...newFile, desc: el.target.value })}
									/>
								</div>

								<div className='w-fit inline-block mr-2'>
									<UploadWidget file={newFile} setFile={setNewFile} />
								</div>

								<button className='btn_primary h-[42px] !px-4 w-36' onClick={action}>
									Add File
								</button>
							</div>
						)}
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

const deleteFileFromCloudinary = async (public_id) => {
	try {
		await http.post('/cloudinary/delete', { public_id });
	} catch (error) {
		console.log(error);
	}
};

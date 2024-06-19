import { Modal } from 'flowbite-react';
import { useState } from 'react';
import UploadWidget from './UploadWidget';
import { FloatField } from '../Fields';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import Link from 'next/link';
import { toast } from 'react-toastify';

export const FileModal = ({ openModal, setOpenModal, handleInputChange }) => {
	const data = openModal.data;
	const [files, setFiles] = useState(data.files || []);
	const [newFile, setNewFile] = useState({ id: '', desc: '', url: '' });

	const action = (el) => {
		el.preventDefault();
		// console.log(files);
		if (!newFile.desc || !newFile.url) {
			return toast.error('Description and file is required!');
		}

		// Add to files list
		const updatedFiles = [...files, { ...newFile, id: Date.now() }];
		setFiles(updatedFiles);
		handleInputChange(data.questionId, 'files', updatedFiles);
		// Reset
		setNewFile({ id: '', desc: '', url: '' });
	};

	const removeFile = (id) => {
		const updatedFiles = files.filter((file) => file.id !== id);
		setFiles(updatedFiles);
		handleInputChange(data.questionId, 'files', updatedFiles);
	};

	return (
		<>
			<Modal dismissible show={openModal.open} onClose={() => setOpenModal({ open: false })}>
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

									<div className='btn_primary !py-[8px] cursor-pointer' onClick={() => removeFile(file.id)}>
										<RiDeleteBin4Fill className='text-[18px] text-red-400' />
									</div>
								</div>
							))}
						</div>

						<div className='addNew _flex gap-x-3'>
							<div className='w-full mb-[-6px]'>
								<FloatField
									label={'File Description'}
									value={newFile?.desc || ''}
									onChange={(el) => setNewFile({ ...newFile, desc: el.target.value })}
								/>
							</div>

							<UploadWidget file={newFile} setFile={setNewFile} />

							<button className='btn_primary !py-2.5 !px-4 w-36' onClick={action}>
								Add File
							</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

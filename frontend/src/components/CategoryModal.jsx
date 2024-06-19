import { Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

export function CategoryModal({ openModal, setOpenModal, createOrUpdateRecord }) {
	const [category, setCategory] = useState(openModal.category);
	const isEdit = openModal.type === 'edit';

	const action = () => {
		createOrUpdateRecord(category);
		setOpenModal({ open: false });
	};

	return (
		<>
			<Modal
				dismissible
				position={'center'}
				show={openModal.open}
				onClose={() => setOpenModal({ open: false })}>
				<Modal.Header>{isEdit ? 'Edit Category' : 'Add New Category'}</Modal.Header>

				<Modal.Body>
					<div className='space-y-6'>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='category' value='Category' />
							</div>
							<TextInput
								id='category'
								value={category?.title || ''}
								onChange={(e) => setCategory({ ...category, title: e.target.value })}
								required
								// placeholder='Enter category'
							/>
						</div>

						<div className='w-full'>
							<button className='btn_primary px-8 w-36' onClick={action}>
								{isEdit ? 'Update' : 'Submit'}
							</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

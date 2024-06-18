import { Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

export function CategoryModal({ openModal, setOpenModal }) {
	const [category, setCategory] = useState('');

	const isEdit = openModal.type === 'edit';

	useEffect(() => {
		const setField = () => {
			setCategory('Arrival and check in - General');
		};

		isEdit && setField();
	}, []);

	return (
		<>
			<Modal
				dismissible
				position={'center'}
				show={openModal.open}
				onClose={() => setOpenModal({ ...openModal, open: false })}>
				<Modal.Header>{isEdit ? 'Edit Category' : 'Add New Category'}</Modal.Header>

				<Modal.Body>
					<div className='space-y-6'>
						<div>
							<div className='mb-2 block'>
								<Label htmlFor='category' value='Category' />
							</div>
							<TextInput
								id='category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								required
								// placeholder='Enter category'
							/>
						</div>

						<div className='w-full'>
							<button className='btn_primary px-8 w-36'>{isEdit ? 'Update' : 'Create'}</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

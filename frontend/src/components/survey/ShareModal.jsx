import { Label, Modal, TextInput } from 'flowbite-react';
import QRCode from 'react-qr-code';

export function ShareModal({ openModal, setOpenModal, link }) {
	return (
		<>
			<Modal dismissible position={'center'} show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>Share Survey</Modal.Header>

				<Modal.Body>
					<div className='_flex justify-center'>
						<QRCode value={link} />
					</div>

					<div className='mt-6'>
						<input
							type='text'
							value={link}
							class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-[#252525] block w-full lg:w-4/5 p-2.5 mx-auto'
							readOnly
						/>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

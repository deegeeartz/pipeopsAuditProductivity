import { useEffect, useRef } from 'react';
import { RiUpload2Line } from 'react-icons/ri';

const UploadWidget = ({ file, setFile }) => {
	const cloudinaryRef = useRef();
	const widgetRef = useRef();

	useEffect(() => {
		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: 'dp8dycfcb',
				uploadPreset: 'audit24',
			},
			function (error, result) {
				// console.log(result);

				// Handle the result or error here
				if (result.event == 'success') {
					setFile((prev) => ({ ...prev, url: result.info.url }));
				}
			}
		);
	}, []);

	return (
		<div>
			<button
				onClick={(el) => {
					el.preventDefault();
					widgetRef.current.open();
				}}
				className={
					'btn_outline fx_center font-bold !py-2.5 !px-2 w-[120px] ' + (file?.url && 'bg-green-200')
				}>
				<RiUpload2Line className='mr-2 text-[18px]' />
				Upload
			</button>
		</div>
	);
};

export default UploadWidget;

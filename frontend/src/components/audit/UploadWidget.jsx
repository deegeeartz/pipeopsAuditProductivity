import { useEffect, useRef } from 'react';
import { RiUpload2Line } from 'react-icons/ri';

const UploadWidget = ({ file, setFile }) => {
	const cloudinaryRef = useRef();
	const widgetRef = useRef();

	useEffect(() => {
		let fileName = `${file.name}_${Date.now()}`;

		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: process.env.NEXT_PUBLIC_CLOUDNAME,
				uploadPreset: process.env.NEXT_PUBLIC_UPLOADPRESET,
				public_id: fileName.replace(' ', '_'),
			},
			function (error, result) {
				// Handle the result or error here

				if (result.event == 'success') {
					// console.log(result);
					setFile((prev) => ({
						...prev,
						url: result.info.url,
						public_id: result.info.public_id,
					}));
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

const SummaryTextField = ({ value, onChange, ...props }) => {
	return (
		<div>
			<textarea
				id='message'
				rows='4'
				value={value}
				onChange={onChange}
				class='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-[#fff] focus:border-[#252525] '
				{...props}
				placeholder='Write comment...'></textarea>
		</div>
	);
};

export default SummaryTextField;

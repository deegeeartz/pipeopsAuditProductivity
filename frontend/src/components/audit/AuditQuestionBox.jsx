const { Button } = require('flowbite-react');
const { FloatField } = require('../Fields');
const { FaPlus } = require('react-icons/fa');

const AuditQuestionBox = ({ id, question, handleInputChange, responses, setFileModal }) => {
	const response = responses.find((res) => res.questionId === question.id);
	console.log(response);

	const showFileModal = () => {
		console.log(response);
		setFileModal({ open: true, data: response });
	};

	return (
		<div className='box py-8 border-b-2 border-gray-300 last-of-type:border-none'>
			<div className='title mb-5 _flex'>
				<i className='text-[12px] font-semibold pr-3'>#{id}</i>
				<span className='text-[15px] font-medium'>{question.text}</span>
			</div>

			{question.type === 'multi_choice' && (
				<div className='mb-6'>
					{Object.entries(JSON.parse(question.options)).map(([key, value], index) => (
						<div key={index} className='flex items-center mb-4'>
							<input
								type='radio'
								id={'key' + key}
								name={'options_' + question.id}
								className='w-4 h-4 border-gray-300 focus:ring-0 !ring-white'
								checked={response.optionAnswer === key}
								onChange={() => handleInputChange(question.id, 'optionAnswer', key)}
							/>
							<label htmlFor={'key' + key} className='block ms-2 text-sm font-normal'>
								{value}
							</label>
						</div>
					))}
				</div>
			)}

			<div className='responses grid md:flex md:fx_between gap-3 md:gap-5'>
				<div className='w-full mb-[-5px]'>
					<FloatField
						label='Enter Comment'
						value={response.answer}
						onChange={(e) => handleInputChange(question.id, 'answer', e.target.value)}
					/>
				</div>

				<div className='flex items-center'>
					<input
						id={'skip_' + question.id}
						type='checkbox'
						className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:!ring-white'
						checked={response.skip}
						onChange={(e) => handleInputChange(question.id, 'skip', e.target.checked)}
					/>
					<label htmlFor={'skip_' + question.id} className='ms-2 text-sm font-medium text-gray-900'>
						N/A
					</label>
				</div>

				<div className='_flex'>
					<Button
						color='success'
						size='sm'
						className='text-nowrap [&>span]:items-center !ring-gray-200'
						onClick={showFileModal}>
						<FaPlus className='mr-2 text-[16px]' />
						File <span className='pl-2 ml-2 border-l'>{response?.files?.length || 0}</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AuditQuestionBox;

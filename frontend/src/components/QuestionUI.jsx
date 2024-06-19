import { Accordion, Badge } from 'flowbite-react';
import { RiCheckboxBlankCircleLine, RiDeleteBin4Fill } from 'react-icons/ri';

export const CategoryPanel = ({ title, count, children }) => {
	return (
		<>
			<Accordion.Title className='!ring-opacity-0 py-4 hover:!bg-gray-50 focus:!bg-gray-50'>
				<div className='capitalize fx_between'>
					<h5 className='text-sm'>{title}</h5>
					<Badge color='failure' className='px-4 ml-2'>
						{count}
					</Badge>
				</div>
			</Accordion.Title>

			<Accordion.Content>{children}</Accordion.Content>
		</>
	);
};

export const QuestionBox = ({ id, question, removeQuestion }) => {
	return (
		<div className='box fx_between py-3 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
			<div className='md:_flex'>
				<i className='text-[12px] font-semibold pr-3'>#{id}</i>
				<span className='text-[13px] font-medium'>{question.text}</span>

				{question.type === 'multi_choice' && (
					<div className=' mt-3'>
						{Object.entries(question.options).map(([key, value]) => (
							<div key={key} className='_flex mb-2'>
								<RiCheckboxBlankCircleLine size={14} className='text-gray-400 mr-2' />
								<span className='text-[13px]'>{value}</span>
							</div>
						))}
					</div>
				)}
			</div>

			<RiDeleteBin4Fill
				size={22}
				onClick={() => removeQuestion(question.id)}
				className='ml-3 mr-2 md:mt-0 cursor-pointer'
			/>
		</div>
	);
};

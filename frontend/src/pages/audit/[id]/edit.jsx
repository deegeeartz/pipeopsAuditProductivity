import { useState } from 'react';
import Layout from '@/components/Layout';
import {
	RiAddFill,
	RiArrowLeftLine,
	RiCheckboxBlankCircleLine,
	RiCloseLine,
	RiDeleteBin4Fill,
	RiUpload2Line,
} from 'react-icons/ri';

import Link from 'next/link';
import { Accordion, Button, Label, Radio } from 'flowbite-react';
import { FloatField, InputFieldStatic, SelectField } from '@/components/Fields';
import { CategoryPanel } from '@/components/QuestionUI';
import { toast } from 'react-toastify';
import { CategoryModal } from '@/components/CategoryModal';
import { FaPlus } from 'react-icons/fa';

const categoryDemo = [
	{ id: 1, text: 'Arrival and check in - General' },
	{ id: 2, text: 'Arrival and check in - Reception' },
	{ id: 3, text: 'Check out and departure - General' },
	{ id: 4, text: 'Check out and departure - Reception' },
];

const questionsDemo = [
	{
		id: '82Q_1713821351111',
		type: 'text',
		title: 'How was your experience at the hotel?',
		categoryId: '1',
		options: {},
	},
	{
		id: '64Q_1713821353243',
		type: 'multi_choice',
		title: 'How was your experience at the hotel?',
		categoryId: '1',
		options: {
			1: 'Very Satisfied',
			2: 'Satisfied',
			3: 'Bad',
			4: 'Very Bad',
		},
	},
	{
		id: '8Q_1713821355477',
		type: 'text',
		title: 'How was your experience at the hotel?',
		categoryId: '2',
		options: {},
	},
	{
		id: '53Q_1713821356093',
		type: 'multi_choice',
		title: 'How was your experience at the hotel?',
		categoryId: '3',
		options: {
			1: 'Very Good',
			2: 'Good',
			3: 'Bad',
			4: 'Very Bad',
		},
	},
];

const EditAudit = () => {
	const [category, setCategory] = useState(categoryDemo);
	const [formData, setFormData] = useState({
		client: 'KM Hotels',
		brand: 'GSmith Hostel ',
		campaign: '2st round 2024',
		location: '13 James Street, Lagos',
		start_date: '2024-05-06',
		end_date: '2024-05-28',
	});
	const [questions, setQuestions] = useState(questionsDemo);

	const onFormSubmit = (el) => {
		el.preventDefault();

		console.log('questions', questions);
		console.log('formData', formData);
	};

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Audit #4647</h1>

					<Link href='/admin/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>All Surveys</span>
					</Link>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full' onSubmit={onFormSubmit}>
						<div className={`details`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<SelectField label={'Client'} value={formData.client ?? ''}>
									<option>select client</option>
									<option>KM Hotels</option>
									<option>JEntertainment LTD</option>
									<option></option>
								</SelectField>
							</div>

							<div className='mb-5'>
								<FloatField label={'Brand'} value={formData.brand ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Campaign'} value={formData.campaign ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Location'} value={formData.location ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Start Date'} value={formData.start_date ?? ''} readOnly type='date' />
							</div>

							<div className='mb-5'>
								<FloatField label={'End Date'} value={formData.end_date ?? ''} readOnly type='date' />
							</div>

							{/* <div className='mb-5'>
								<SelectField label={'Assign Inspector'} multiple={true}>
									<option>select inspector</option>
									<option>Paul Smith</option>
									<option>David Samuel</option>
									<option>Aaron James</option>
								</SelectField>
							</div> */}
						</div>

						<div className={`questionnaire`}>
							<h3 className='heading text-xl font-semibold pt-4 mb-8 uppercase'>Questionnaire</h3>

							{!questions.length ? (
								<p className='text-red-500 mb-4'>No questions added!</p>
							) : (
								<div className='mb-5'>
									<Accordion>
										{category.map((item) => {
											const categoryQuestions = questions.filter(
												(question) => question.categoryId === item.id.toString()
											);

											if (categoryQuestions.length === 0) {
												return <></>;
											}

											return (
												<Accordion.Panel key={item.id} className='box'>
													<CategoryPanel title={item.text} count={categoryQuestions.length}>
														{categoryQuestions.map((question, index) => (
															<SurveyQuestionBox key={index} id={index + 1} question={question} />
														))}
													</CategoryPanel>
												</Accordion.Panel>
											);
										})}
									</Accordion>
								</div>
							)}
						</div>

						<div className='py-5 _flex'>
							<button type='submit' className='btn_primary _flex !px-[10px] !py-[10px] md:!px-[30px]'>
								<RiUpload2Line size={22} className='mr-3' />
								<span>Submit</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

const SurveyQuestionBox = ({ id, question, removeQuestion }) => {
	return (
		<div className='box py-8 border-b-2 border-gray-300 last-of-type:border-none'>
			<div className='title mb-5 _flex'>
				<i className='text-[12px] font-semibold pr-3'>#{id}</i>
				<span className='text-[15px] font-medium'>{question.title}</span>
			</div>

			{question.type === 'multi_choice' && (
				<div className='mb-6'>
					{Object.entries(question.options).map(([key, value]) => (
						<div key={key + question.id} className='flex items-center mb-4'>
							<input
								type='radio'
								id={key + question.id}
								name={'options_' + question.id}
								className='w-4 h-4 border-gray-300 focus:ring-0 !ring-white'
							/>
							<label htmlFor={key + question.id} className='block ms-2 text-sm font-normal'>
								{value}
							</label>
						</div>
					))}
				</div>
			)}

			<div className='responses grid md:flex md:fx_between gap-3 md:gap-5'>
				<div className='w-full mb-[-5px]'>
					<FloatField label={'Enter Answer'} />
				</div>

				<div className='flex items-center'>
					<input
						id={'checkbox_null_' + question.id}
						type='checkbox'
						className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:!ring-white'
					/>
					<label htmlFor={'checkbox_null_' + question.id} className='ms-2 text-sm font-medium text-gray-900 '>
						N/A
					</label>
				</div>

				<div className='_flex'>
					<Button color='success' size='sm' className='text-nowrap [&>span]:items-center !ring-gray-200'>
						<FaPlus className='mr-2 text-[16px]' />
						File <span className='pl-2 ml-2 border-l'>0</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EditAudit;

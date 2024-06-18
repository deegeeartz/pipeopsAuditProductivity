import { useState } from 'react';
import Layout from '@/components/Layout';
import { RiAddFill, RiArrowLeftLine, RiCheckboxBlankCircleLine, RiCloseLine } from 'react-icons/ri';

import Link from 'next/link';
import { Accordion } from 'flowbite-react';
import { FloatField, InputFieldStatic, SelectField } from '@/components/Fields';
import { CategoryPanel, QuestionBox } from '@/components/QuestionUI';
import { toast } from 'react-toastify';

const categoryData = [
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

const CreateSurvey = () => {
	// const [openDelModal, setOpenDelModal] = useState(false);
	const [step, setStep] = useState(1);
	const [category, setCategory] = useState(categoryData);
	const [formData, setFormData] = useState({});
	const [questions, setQuestions] = useState(questionsDemo);

	const removeQuestion = (id) => {
		setQuestions(questions.filter((item) => item.id !== id));
	};

	const CreateSurvey = (el) => {
		el.preventDefault();

		console.log('questions', questions);
		console.log('formData', formData);
	};

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Create Survey</h1>
					<Link href='/admin/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>All Surveys</span>
					</Link>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full' onSubmit={CreateSurvey}>
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<SelectField label={'Client'}>
									<option>select client</option>
									<option>KM Hotels</option>
									<option>JEntertainment LTD</option>
									<option></option>
								</SelectField>
							</div>

							<div className='mb-5'>
								<FloatField label={'Brand'} value={''} />
							</div>

							<div className='mb-5'>
								<FloatField label={'Campaign'} value={''} />
							</div>

							<div className='mb-5'>
								<FloatField label={'Location'} value={''} />
							</div>

							<div className='mb-5'>
								<SelectField label={'Assign Inspector'}>
									<option>select inspector</option>
									<option>Paul Smith</option>
									<option>David Samuel</option>
								</SelectField>
							</div>
						</div>

						<div className={`step2 questionnaire ${step !== 2 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Questionnaire</h3>

							<div className='fx_between mb-7'>
								<p className='heading text-base font-medium'>Add Questions</p>
								<div className='btn_outline'>New category</div>
							</div>

							<AddQuestion category={category} setQuestions={setQuestions} />

							<div className='mt-8 mb-6 border border-gray-300' />
							<p className='heading text-base font-medium mb-7'>Questions ({questions.length})</p>

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
															<QuestionBox
																key={index}
																id={index + 1}
																question={question}
																removeQuestion={removeQuestion}
															/>
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
							<button
								type='button'
								onClick={() => (step == 1 ? setStep(2) : setStep(1))}
								className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
								{step == 1 ? 'Next' : 'Previous'}
							</button>

							{step == 2 && (
								<button type='submit' className='btn_primary _flex !px-[10px] !py-[10px] md:!px-[30px]'>
									<RiAddFill size={22} className='mr-1.5' />
									<span>Create Survey</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

const AddQuestion = ({ category, setQuestions }) => {
	const [data, setData] = useState({ id: '', type: 'text', title: '', categoryId: '' });
	const [options, setOptions] = useState({});
	const [optionFields, setOptionFields] = useState([1, 2]);

	const addOptionField = () => {
		const lastID = optionFields[optionFields.length - 1] ?? 0;
		const id = lastID + 1;
		setOptionFields([...optionFields, id]);
		// console.log(id, data, options);
	};

	const onChangeInput = (el, id) => {
		setOptions({ ...options, [id]: el.target.value });
		// console.log(el.target);
	};

	const removeOptionField = (id) => {
		setOptionFields(optionFields.filter((idx) => idx !== id));
		const newOptions = { ...options, [id]: '' };
		setOptions(newOptions);
	};

	const submitForm = (el) => {
		el.preventDefault();
		// Get valid options
		const filteredOptions = Object.fromEntries(
			Object.entries(options).filter(([key, value]) => value.trim() !== '')
		);

		// Validation
		if (!data.categoryId) {
			toast.error('Category is required!', {});
			return;
		}
		if (!data.type) {
			toast.error('Field Type is required!', {});
			return;
		}
		if (!data.title) {
			toast.error('Question field is required!', {});
			return;
		}
		if (data.type == 'multi_choice' && Object.keys(filteredOptions).length === 0) {
			toast.error('Option field is required!', {});
			return;
		}

		// Generate ID
		const id = Math.floor(Math.random() * 99) + 'Q_' + Date.now();
		const questionData = { ...data, id, options: filteredOptions };
		setQuestions((prev) => [...prev, questionData]);
		// Reset Data
		setData({ type: 'text' });
		console.log(questionData);

		toast.success('Question added successfully!', {});
	};

	return (
		<>
			<div className='mb-5 w-full md:flex'>
				<SelectField
					label='Category'
					value={data?.category ?? ''}
					onChange={(el) => setData({ ...data, categoryId: el.target.value })}>
					<option value=''>select category</option>
					{category.map((item) => (
						<option value={item.id}>{item.text}</option>
					))}
				</SelectField>

				<SelectField
					label='Type'
					style='md:w-1/3 md:ml-4 mt-4 md:m-0'
					value={data.type ?? ''}
					onChange={(el) => setData({ ...data, type: el.target.value })}>
					<option value=''>select field type</option>
					<option value='text'>Text</option>
					<option value='multi_choice'>Multi Choice</option>
				</SelectField>
			</div>

			<div className='mb-6 md:mb-3 md:flex items-center'>
				<div className='w-full mb-4 md:mb-0'>
					<FloatField
						label={'Enter Question'}
						value={data.title ?? ''}
						onChange={(el) => setData({ ...data, title: el.target.value })}
					/>
				</div>

				<button className='btn_primary _flex md:ml-2 !py-[11px] mb-[8px]' onClick={submitForm}>
					<RiAddFill size={24} />
					<span className='ml-3 md:hidden'>Add</span>
				</button>
			</div>

			{data.type == 'multi_choice' && (
				<div className='multi_choice pb-2'>
					{optionFields.map((id, index) => (
						<OptionField
							label={'Option ' + id}
							key={id}
							value={options[id]}
							onChange={(el) => onChangeInput(el, id)}
							removeOptionField={() => removeOptionField(id)}
						/>
					))}

					<div className='w-full mb-2 _flex'>
						<RiCheckboxBlankCircleLine size={24} className='text-gray-400 mt-1 mr-3' />
						<InputFieldStatic
							label={'Add option'}
							style='focus:!border-gray-200 placeholder:text-[#252525]'
							onClick={addOptionField}
							readOnly={true}
						/>
						<RiCloseLine size={26} className='mx-4 opacity-0' />
					</div>
				</div>
			)}
		</>
	);
};

const OptionField = ({ label, value, removeOptionField, ...props }) => (
	<div className='w-full mb-2 _flex'>
		<RiCheckboxBlankCircleLine size={24} className='text-gray-400 mt-1 mr-3' />
		<InputFieldStatic label={label} style='' value={value} {...props} />
		<RiCloseLine size={26} className='mx-4 cursor-pointer' onClick={removeOptionField} />
	</div>
);

export default CreateSurvey;

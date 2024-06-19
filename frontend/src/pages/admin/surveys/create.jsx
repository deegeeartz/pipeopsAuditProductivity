import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiAddFill, RiArrowLeftLine, RiCheckboxBlankCircleLine, RiCloseLine } from 'react-icons/ri';

import Link from 'next/link';
import { Accordion } from 'flowbite-react';
import { FloatField, InputFieldStatic, SelectField } from '@/components/Fields';
import { CategoryPanel, QuestionBox } from '@/components/QuestionUI';
import { toast } from 'react-toastify';
import { CategoryModal } from '@/components/CategoryModal';
import { Loader } from '@/components/Loader';
import { errorHandler } from '@/utils/errorHandler';
import http from '@/config/axios';
import { useRouter } from 'next/router';

const CreateSurvey = () => {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [openCatModal, setOpenCatModal] = useState({ open: false });
	const [CATEGORIES, setCategories] = useState([]);
	const [CLIENTS, setClients] = useState([]);
	const [formData, setFormData] = useState({});
	const [questions, setQuestions] = useState([]);
	const [isLoading, setLoading] = useState(true);

	const fetchCategory = async () => {
		try {
			const categories = await http.get('/category');
			const clients = await http.get('/client/list');

			if (categories?.status == 200 && clients?.status == 200) {
				// console.log(categories.data.result, clients.data.result);
				setCategories(categories.data.result);
				setClients(clients.data.result);
			}
		} catch (error) {
			errorHandler(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategory();
	}, []);

	if (isLoading) {
		return (
			<div className='h-screen grid_center'>
				<Loader />
			</div>
		);
	}

	const nextStep = () => {
		console.log(formData);

		const fieldValidation = () => {
			if (!formData.clientId) {
				toast.error('Client field is required');
				return false;
			}

			// if (!formData.hotelName) {
			// 	toast.error('Hotel Name is required');
			// 	return false;
			// }

			return true;
		};

		window.scrollTo({ top: 0, behavior: 'smooth' });
		if (step == 1 && fieldValidation()) setStep(2);
		// Go to previous step
		step == 2 && setStep(1);
	};

	const removeQuestion = (id) => {
		setQuestions(questions.filter((item) => item.id !== id));
	};

	const onFormSubmit = async (el) => {
		el.preventDefault();

		const { name: clientName } = CLIENTS.filter((item) => item.id == formData?.clientId)[0].user;
		const payload = {
			hotelName: formData?.hotelName,
			campaign: formData?.campaign,
			location: formData?.location,
			startDate: formData?.start_date,
			endDate: formData?.end_date,
			clientId: formData?.clientId,
			clientName: clientName,
			questions: questions.map((question) => ({ ...question, categoryId: parseInt(question.categoryId) })),
		};

		console.log('payload', payload);
		// return console.log('payload', payload);

		try {
			const res = await http.post('/survey', payload);
			if (res?.status == 201) {
				toast.success(res.data.message);
				router.push('/admin/surveys');
			}
		} catch (error) {
			errorHandler(error);
		}
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
					<form className='w-full' onSubmit={onFormSubmit}>
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<SelectField
									label={'Client'}
									value={formData.clientId ?? ''}
									onChange={(el) => setFormData({ ...formData, clientId: el.target.value })}>
									<option>select client</option>

									{/* Display clients */}
									{CLIENTS.map((item) => (
										<option value={item.id} key={item.id}>
											{item.user.name}
										</option>
									))}
								</SelectField>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Hotel Name'}
									value={formData.hotelName ?? ''}
									onChange={(el) => setFormData({ ...formData, hotelName: el.target.value })}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Campaign'}
									value={formData.campaign ?? ''}
									onChange={(el) => setFormData({ ...formData, campaign: el.target.value })}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Location'}
									value={formData.location ?? ''}
									onChange={(el) => setFormData({ ...formData, location: el.target.value })}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Start Date'}
									value={formData.start_date ?? ''}
									onChange={(el) => setFormData({ ...formData, start_date: el.target.value })}
									type='date'
									onClick={(el) => el.target.showPicker()}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={formData.end_date ?? ''}
									onChange={(el) => setFormData({ ...formData, end_date: el.target.value })}
									type='date'
									onClick={(el) => el.target.showPicker()}
								/>
							</div>

							{/* <div className='mb-5'>
								<SelectField label={'Assign Inspector'}>
									<option>select inspector</option>
									<option>Paul Smith</option>
									<option>David Samuel</option>
								</SelectField>
							</div> */}
						</div>

						<div className={`step2 questionnaire ${step !== 2 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Questionnaire</h3>

							<div className='fx_between mb-7'>
								<p className='heading text-base font-medium'>Add Questions</p>
								<div className='btn_outline' onClick={() => setOpenCatModal({ open: true, type: 'create' })}>
									New category
								</div>
							</div>

							<AddQuestion category={CATEGORIES} setQuestions={setQuestions} />

							<div className='mt-8 mb-6 border border-gray-300' />
							<p className='heading text-base font-medium mb-7'>Questions ({questions.length})</p>

							{!questions.length ? (
								<p className='text-gray-400 mb-4'>No questions added!</p>
							) : (
								<div className='mb-5'>
									<Accordion>
										{CATEGORIES.filter((item) =>
											questions.some((question) => question.categoryId === item.id.toString())
										).map((item) => {
											const categoryQuestions = questions.filter(
												(question) => question.categoryId === item.id.toString()
											);

											return (
												<Accordion.Panel key={item.id} className='box'>
													<CategoryPanel title={item.title} count={categoryQuestions.length}>
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
							<button type='button' onClick={nextStep} className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
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

			{openCatModal.open && (
				<CategoryModal
					openModal={openCatModal}
					setOpenModal={setOpenCatModal}
					setCategories={setCategories}
				/>
			)}
		</Layout>
	);
};

const AddQuestion = ({ category, setQuestions }) => {
	const [data, setData] = useState({ id: '', type: 'text', text: '', categoryId: '' });
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
	};

	const removeOptionField = (id) => {
		setOptionFields(optionFields.filter((idx) => idx !== id));
		const newOptions = { ...options, [id]: '' };
		setOptions(newOptions);
	};

	const submitForm = (el) => {
		el.preventDefault();
		// Get valid options
		const filteredOptions =
			data.type == 'multi_choice'
				? Object.fromEntries(Object.entries(options).filter(([key, value]) => value.trim() !== ''))
				: {};

		// Validation
		if (!data.categoryId) {
			toast.error('Category is required!', {});
			return;
		}
		if (!data.type) {
			toast.error('Field Type is required!', {});
			return;
		}
		if (!data.text) {
			toast.error('Question field is required!', {});
			return;
		}
		if (data.type == 'multi_choice' && Object.keys(filteredOptions).length === 0) {
			toast.error('Option field is required!', {});
			return;
		}

		// Add question to state
		const questionData = { ...data, id: Date.now(), options: filteredOptions };
		setQuestions((prev) => [...prev, questionData]);

		// Reset Data
		setData({ ...data, text: '', type: 'text' });
		console.log(questionData);

		toast.success('Question added successfully!', {});
	};

	return (
		<>
			<div className='mb-5 w-full md:flex'>
				<SelectField
					label='Category'
					value={data?.categoryId ?? ''}
					onChange={(el) => setData({ ...data, categoryId: el.target.value })}>
					<option value=''>select category</option>
					{category.map((item, index) => (
						<option key={index} value={item.id}>
							{item.title}
						</option>
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
						value={data.text ?? ''}
						onChange={(el) => setData({ ...data, text: el.target.value })}
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

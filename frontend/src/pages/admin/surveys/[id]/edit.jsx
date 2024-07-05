import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiArrowLeftLine, RiUpload2Line } from 'react-icons/ri';
import Link from 'next/link';
import { Accordion } from 'flowbite-react';
import { FloatField, SelectField } from '@/components/Fields';
import { CategoryPanel, QuestionBox } from '@/components/QuestionUI';
import { toast } from 'react-toastify';
import { CategoryModal } from '@/components/CategoryModal';
import { Loader } from '@/components/Loader';
import { errorHandler } from '@/utils/errorHandler';
import http from '@/config/axios';
import { useRouter } from 'next/router';
import AddQuestion from '@/components/survey/AddQuestion';
import { LocationSuggestionInput2 } from '@/components/form/LocationSuggestionField';
import { AutoSaveButton } from '@/components/common/AutoSaveButton';

const EditSurvey = () => {
	const router = useRouter();
	const { id: surveyId } = router.query;
	const [step, setStep] = useState(1);
	const [openCatModal, setOpenCatModal] = useState({ open: false });
	const [CATEGORIES, setCategories] = useState([]);
	const [CLIENTS, setClients] = useState([]);
	const [formData, setFormData] = useState({});
	const [questions, setQuestions] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [loadingAPI, setLoadingAPI] = useState(false);

	const fetchData = async () => {
		try {
			const survey = await http.get('/survey/' + surveyId);
			const clients = await http.get('/client/list');
			const categories = await http.get('/category/list');

			if (survey?.status == 200 || categories?.status == 200 || clients?.status == 200) {
				setCategories(categories?.data?.result || []);
				setClients(clients?.data?.result || []);
				setFormData(survey?.data?.result || {});
				setQuestions(survey?.data?.result?.questions || []);
			}
		} catch (error) {
			errorHandler(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (surveyId) {
			fetchData();
		}
	}, [surveyId]);

	if (isLoading) {
		return (
			<div className='h-screen grid_center'>
				<Loader />
			</div>
		);
	}

	const nextStep = () => {
		// console.log(formData);

		const fieldValidation = () => {
			if (!formData?.clientId) {
				toast.error('Client field is required');
				return false;
			}

			if (!formData?.hotelName) {
				toast.error('Hotel Name is required');
				return false;
			}

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
		setLoadingAPI(true);

		const { name: clientName } = CLIENTS.filter((item) => item.id == formData?.clientId)[0].user;

		const payload = {
			hotelName: formData?.hotelName,
			campaign: formData?.campaign,
			location: formData?.location,
			startDate: formData?.startDate,
			endDate: formData?.endDate,
			clientId: formData?.clientId,
			clientName: clientName,
			questions: questions.map((question) => ({ ...question, categoryId: parseInt(question.categoryId) })),
		};

		// return console.log('payload', payload);

		try {
			const res = await http.put(`/survey/${surveyId}`, payload);
			if (res?.status == 200) {
				toast.success(res.data.message);
			}
		} catch (error) {
			errorHandler(error);
		} finally {
			setLoadingAPI(false);
		}
	};

	const formatDateForInput = (dateString) => {
		return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
	};

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Edit Survey</h1>
					<Link href='/admin/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>All Surveys</span>
					</Link>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full' onSubmit={onFormSubmit}>
						{/* STEP 1 */}
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<SelectField
									label={'Client'}
									value={formData.clientId || ''}
									onChange={(el) => setFormData({ ...formData, clientId: el.target.value })}>
									<option value=''>select client</option>

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
								<LocationSuggestionInput2
									label={'Location'}
									value={formData.location ?? ''}
									handleInputValue={(text) => setFormData({ ...formData, location: text })}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Start Date'}
									value={formatDateForInput(formData.startDate)}
									onChange={(el) => setFormData({ ...formData, startDate: el.target.value })}
									type='date'
									onClick={(el) => el.target.showPicker()}
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={formatDateForInput(formData.endDate)}
									onChange={(el) => setFormData({ ...formData, endDate: el.target.value })}
									type='date'
									onClick={(el) => el.target.showPicker()}
								/>
							</div>
						</div>

						{/* STEP 2 */}
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
											questions.some((question) => question.categoryId == item.id)
										).map((item) => {
											const categoryQuestions = questions.filter(
												(question) => question.categoryId == item.id
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
									<RiUpload2Line size={22} className='mr-1.5' />
									<span>update Survey</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>

			<AutoSaveButton action={onFormSubmit} loading={loadingAPI} />

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

export default EditSurvey;

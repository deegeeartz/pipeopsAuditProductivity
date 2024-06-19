import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiArrowLeftLine, RiUpload2Line } from 'react-icons/ri';
import Link from 'next/link';
import { Accordion, Badge } from 'flowbite-react';
import { FloatField } from '@/components/Fields';
import { CategoryPanel, QuestionBox } from '@/components/QuestionUI';
import { CategoryModal } from '@/components/CategoryModal';
import { Loader } from '@/components/Loader';
import { errorHandler } from '@/utils/errorHandler';
import http from '@/config/axios';
import { useRouter } from 'next/router';

const ViewSurvey = () => {
	const router = useRouter();
	const { id: surveyId } = router.query;
	const [step, setStep] = useState(1);
	const [openCatModal, setOpenCatModal] = useState({ open: false });
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({});
	const [questions, setQuestions] = useState([]);
	const [isLoading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const survey = await http.get('/survey/' + surveyId);

			if (survey?.status == 200) {
				setCategories(survey.data.result.categories);
				setFormData(survey.data.result);
				setQuestions(survey.data.result.questions);
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
		window.scrollTo({ top: 0, behavior: 'smooth' });
		step == 1 ? setStep(2) : setStep(1);
	};

	const removeQuestion = (id) => {
		setQuestions(questions.filter((item) => item.id !== id));
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
					<form className='w-full'>
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>
							<div className='mb-5'>
								<FloatField label={'Client'} value={formData.clientName || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Hotel Name'} value={formData.hotelName || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Campaign'} value={formData.campaign || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Location'} value={formData.location || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Start Date'}
									value={formData.startDate ? new Date(formData.startDate).toDateString() : ''}
									readOnly
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={formData.endDate ? new Date(formData.endDate).toDateString() : ''}
									readOnly
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
							<h3 className='heading text-xl font-semibold mb-8 uppercase flex items-center'>
								<span>Questionnaire</span>
								<Badge color='dark' className='px-3 ml-4'>
									{questions.length}
								</Badge>
							</h3>

							{!questions.length ? (
								<p className='text-gray-400 mb-4'>No questions added!</p>
							) : (
								<div className='mb-5'>
									<Accordion>
										{categories.map((category) => (
											<Accordion.Panel key={category.id} className='box'>
												<CategoryPanel title={category.title} count={category.questions.length}>
													{/* Display questions */}
													{category.questions.map((question, index) => (
														<QuestionBox key={index} id={index + 1} question={question} />
													))}
												</CategoryPanel>
											</Accordion.Panel>
										))}
									</Accordion>
								</div>
							)}
						</div>

						<div className='py-5 _flex'>
							<button type='button' onClick={nextStep} className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
								{step == 1 ? 'Next' : 'Previous'}
							</button>
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

export default ViewSurvey;

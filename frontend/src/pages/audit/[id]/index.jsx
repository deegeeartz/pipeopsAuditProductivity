import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiAddFill, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';
import { Accordion, Badge } from 'flowbite-react';
import { FloatField, SelectField } from '@/components/Fields';
import { CategoryPanel } from '@/components/QuestionUI';
import { toast } from 'react-toastify';
import { Loader } from '@/components/Loader';
import { errorHandler } from '@/utils/errorHandler';
import http from '@/config/axios';
import { useRouter } from 'next/router';
import AuditQuestionBox from '@/components/audit/AuditQuestionBox';
import SummaryTextField from '@/components/audit/SummaryTextField';
import { FileModal } from '@/components/audit/FileModal';
import Script from 'next/script';

const StartAudit = () => {
	const router = useRouter();
	const { id: surveyId } = router.query;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({});
	const [categories, setCategories] = useState([]);
	const [responses, setResponses] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [fileModal, setFileModal] = useState({ open: false, data: {} });

	const fetchData = async () => {
		try {
			const survey = await http.get('/survey/' + surveyId);

			if (survey?.status == 200) {
				console.log(survey.data.result);

				setFormData(survey.data.result);
				setCategories(survey.data.result.categories);
				setResponses(
					survey.data.result.questions.map((ques) => ({
						questionId: ques.id,
						answer: '',
						optionAnswer: '',
						files: [],
						skip: false,
					}))
				);
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
		console.log(formData);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		step == 1 ? setStep(2) : setStep(1);
	};

	const countFilledQuestions = (questions) => {
		return questions.filter((question) => {
			const response = responses.find((r) => r.questionId == question.id);
			return response && (response.answer.trim() || response.optionAnswer || response.skip);
		}).length;
	};

	const handleInputChange = (questionId, field, value) => {
		setResponses(responses.map((res) => (res.questionId === questionId ? { ...res, [field]: value } : res)));
	};

	const onFormSubmit = async (el) => {
		el.preventDefault();

		const payload = {
			expense: formData?.expense,
			brandStandard: formData?.brandStandard,
			executiveSummary: formData?.executiveSummary,
			detailedSummary: formData?.detailedSummary,
			scenario: formData?.scenario,
			status: formData?.status || 'in progress',
			surveyId,
			responses,
		};

		// return console.log(payload);

		try {
			const res = await http.post('/audit', payload);
			if (res?.status == 201) {
				toast.success(res.data.message);
				router.push('/inspector');
			}
		} catch (error) {
			errorHandler(error);
		}
	};

	return (
		<Layout>
			<Script src='https://upload-widget.cloudinary.com/global/all.js' type='text/javascript'></Script>

			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Survey #{surveyId}</h1>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full readOnly' onSubmit={onFormSubmit}>
						{/* STEP 1 */}
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
									value={new Date(formData.startDate).toDateString() || ''}
									readOnly
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={new Date(formData.endDate).toDateString() || ''}
									readOnly
								/>
							</div>
						</div>

						{/* STEP 2 */}
						<div className={`step2 questionnaire ${step !== 2 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase flex items-center'>
								<span>Questionnaire</span>
								<Badge color='dark' className='px-3 ml-4'>
									{formData?.questions.length}
								</Badge>
							</h3>

							{!formData?.questions?.length ? (
								<p className='text-gray-400 mb-4'>No questions found!</p>
							) : (
								<div className='mb-5'>
									<Accordion>
										{categories.map((category) => (
											<Accordion.Panel key={category.id} className='box'>
												<CategoryPanel
													title={category.title}
													filledCount={countFilledQuestions(category.questions)}
													count={category.questions.length}>
													{/* Display questions */}
													{category.questions.map((question, index) => (
														<AuditQuestionBox
															key={index}
															id={index + 1}
															question={question}
															handleInputChange={handleInputChange}
															responses={responses}
															setFileModal={setFileModal}
														/>
													))}
												</CategoryPanel>
											</Accordion.Panel>
										))}
									</Accordion>
								</div>
							)}

							<h3 className='heading text-xl font-semibold pt-4 mb-8 uppercase'>Summary</h3>

							<Accordion>
								<Accordion.Panel className='box'>
									<CategoryPanel title={'Brand Standard'} summaryField={formData?.brandStandard || ''}>
										<SummaryTextField
											value={formData?.brandStandard || ''}
											onChange={(el) => setFormData({ ...formData, brandStandard: el.target.value })}
										/>
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Executive Summary'} summaryField={formData?.executiveSummary || ''}>
										<SummaryTextField
											value={formData?.executiveSummary || ''}
											onChange={(el) => setFormData({ ...formData, executiveSummary: el.target.value })}
										/>
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Detailed Summary'} summaryField={formData?.detailedSummary || ''}>
										<SummaryTextField
											value={formData?.detailedSummary || ''}
											onChange={(el) => setFormData({ ...formData, detailedSummary: el.target.value })}
										/>
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Scenario'} summaryField={formData?.scenario || ''}>
										<SummaryTextField
											value={formData?.scenario || ''}
											onChange={(el) => setFormData({ ...formData, scenario: el.target.value })}
										/>
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Expense'} summaryField={formData?.expense || ''}>
										<SummaryTextField
											value={formData?.expense || ''}
											onChange={(el) => setFormData({ ...formData, expense: el.target.value })}
										/>
									</CategoryPanel>
								</Accordion.Panel>
							</Accordion>

							<div className='py-5 mt-4'>
								<p className='text-[15px] font-medium pb-2'>Audit Status</p>

								<select
									className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-[#252525] block w-full p-2.5 '
									value={formData.status || ''}
									onChange={(el) => setFormData({ ...formData, status: el.target.value })}
									//
								>
									<option value={'in progress'} selected>
										In progress
									</option>
									<option value={'completed'}>Completed</option>
								</select>
							</div>
						</div>

						<div className='py-5 _flex'>
							<button type='button' onClick={nextStep} className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
								{step == 1 ? 'Next' : 'Previous'}
							</button>

							{step == 2 && (
								<button type='submit' className='btn_primary _flex !px-[10px] !py-[10px] md:!px-[30px]'>
									<RiAddFill size={22} className='mr-1.5' />
									<span>Create Audit</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>

			{fileModal.open && (
				<FileModal openModal={fileModal} setOpenModal={setFileModal} handleInputChange={handleInputChange} />
			)}
		</Layout>
	);
};

export default StartAudit;

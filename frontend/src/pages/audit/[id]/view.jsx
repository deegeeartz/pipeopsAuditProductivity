import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiUpload2Line, RiUploadLine } from 'react-icons/ri';
import { Accordion, Badge } from 'flowbite-react';
import { FloatField } from '@/components/Fields';
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
import { useAuth } from '@/context/AuthProvider';

const ViewAudit = () => {
	const router = useRouter();
	const { user } = useAuth();
	const { id: auditId } = router.query;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({});
	const [survey, setSurvey] = useState({});
	const [categories, setCategories] = useState([]);
	const [responses, setResponses] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [fileModal, setFileModal] = useState({ open: false, data: {} });

	const fetchData = async () => {
		try {
			const res = await http.get('/audit/' + auditId);

			if (res?.status == 200) {
				console.log(res.data.result);

				setFormData(res.data.result);
				setResponses(res.data.result.responses);
				setSurvey(res.data.result.survey);
				setCategories(res.data.result.categories);
			}
		} catch (error) {
			errorHandler(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (auditId) {
			fetchData();
		}
	}, [auditId]);

	if (isLoading) {
		return (
			<div className='h-screen grid_center'>
				<Loader />
			</div>
		);
	}

	const nextStep = () => {
		console.log('audit: ', formData);
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
		const { feedback } = formData;

		console.log('feedback', feedback);
		if (!feedback?.trim()) {
			return toast.error('Feedback field is required!');
		}

		const payload = { feedback: feedback?.trim() };
		try {
			const res = await http.patch(`/audit/${auditId}/feedback`, payload);
			if (res?.status == 200) {
				toast.success(res.data.message);
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
					<h1 className='font-bold text-lg text-[#222]'>Audit #{auditId}</h1>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full readOnly' onSubmit={onFormSubmit}>
						{/* STEP 1 */}
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<FloatField label={'Client'} value={survey.clientName || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Hotel Name'} value={survey.hotelName || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Campaign'} value={survey.campaign || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Location'} value={survey.location || ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Start Date'}
									value={new Date(survey.startDate).toDateString() || ''}
									readOnly
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={new Date(survey.endDate).toDateString() || ''}
									readOnly
								/>
							</div>
						</div>

						{/* STEP 2 */}
						<div className={`step2 questionnaire ${step !== 2 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase flex items-center'>
								<span>Questionnaire</span>
								<Badge color='dark' className='px-3 ml-4'>
									{survey?.questions.length}
								</Badge>
							</h3>

							{!survey?.questions?.length ? (
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
															view={true}
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
										<SummaryTextField value={formData?.brandStandard || ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Executive Summary'} summaryField={formData?.executiveSummary || ''}>
										<SummaryTextField value={formData?.executiveSummary || ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Detailed Summary'} summaryField={formData?.detailedSummary || ''}>
										<SummaryTextField value={formData?.detailedSummary || ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Scenario'} summaryField={formData?.scenario || ''}>
										<SummaryTextField value={formData?.scenario || ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Expense'} summaryField={formData?.expense || ''}>
										<SummaryTextField value={formData?.expense || ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>
							</Accordion>

							<div className='py-5 mt-4'>
								<p className='text-[15px] font-medium pb-2'>Audit Status</p>

								<select
									className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-[#252525] block w-full p-2.5 '
									defaultValue={formData.status || ''}
									readOnly
									disabled
									//
								>
									<option value={'in progress'}>In progress</option>
									<option value={'completed'}>Completed</option>
								</select>
							</div>

							<div className='py-5 mt-4'>
								<p className='text-[15px] font-medium pb-2'>Feedback</p>

								<SummaryTextField
									value={formData?.feedback || ''}
									onChange={(el) => setFormData({ ...formData, feedback: el.target.value })}
									readOnly={survey.clientId !== user?.client?.id}
								/>
							</div>
						</div>

						<div className='py-5 _flex'>
							<button type='button' onClick={nextStep} className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
								{step == 1 ? 'Next' : 'Previous'}
							</button>

							{step == 2 && survey.clientId == user?.client?.id && (
								<button type='submit' className='btn_primary _flex !px-[5px] !py-[10px] md:!px-[30px]'>
									<RiUploadLine size={22} className='mr-1.5' />
									<span>Submit Feedback</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>

			{fileModal.open && (
				<FileModal
					openModal={fileModal}
					setOpenModal={setFileModal}
					handleInputChange={handleInputChange}
					view={true}
				/>
			)}
		</Layout>
	);
};

export default ViewAudit;

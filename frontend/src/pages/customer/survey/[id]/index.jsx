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
import { LoaderOverlay } from '../../../../components/common/LoaderOverlay';
import { UploadsModal } from '@/components/UploadsModal';
import { UploadFileButton } from '@/components/common/UploadFileButton';
import axios from 'axios';

const CustomerAudit = () => {
	const router = useRouter();
	const { id: surveyId } = router.query;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({});
	const [categories, setCategories] = useState([]);
	const [responses, setResponses] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [fileModal, setFileModal] = useState({ open: false, data: {} });
	const [loadingRequest, setLoadingRequest] = useState(false);
	const [uploads, setUploads] = useState({});
	const [uploadModal, setUploadModal] = useState({ open: false, data: {} });

	const fetchData = async () => {
		try {
			const survey = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/customer/survey/' + surveyId);

			if (survey?.status == 200) {
				// console.log(survey.data.result);

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
			console.log(error);
			const errorMessage = error?.response?.data?.error || 'An error occurred! Please try again. ';
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (surveyId) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		setLoadingRequest(true);

		const payload = {
			expense: formData?.expense,
			brandStandard: formData?.brandStandard,
			executiveSummary: formData?.executiveSummary,
			detailedSummary: formData?.detailedSummary,
			scenario: formData?.scenario,
			status: formData?.status || 'in progress',
			surveyId,
			uploads,
			responses,
		};

		try {
			const { status, data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/customer/audit', payload);
			if (status == 201) {
				// const { id } = data.result;
				toast.success(data.message);
				router.push(`/customer/thankyou`);
			}
		} catch (error) {
			console.log(error);
			const errorMessage = error?.response?.data?.error || 'An error occurred! Please try again. ';
			toast.error(errorMessage);
			setLoadingRequest(false);
		}
	};

	return (
		<main className={`w-full bg-gray-100 min-h-screen transition-all main`}>
			{/* HEADER */}
			<div className='py-4 px-6 bg-[#fff] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30'>
				<Link href='/' className='flex items-center'>
					<img src='/logo.png' alt='Logo' className='w-[90px] mx-auto' />
				</Link>

				<ul className='ml-auto flex items-center'>
					<button
						id='fullscreen-button'
						className='hover:bg-gray-100 p-1 rounded-full'
						onClick={toggleFullscreen}>
						<svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
							<path d='M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z' />
						</svg>
					</button>
				</ul>
			</div>

			<div className='container mx-auto max-w-screen-lg'>
				{loadingRequest && <LoaderOverlay />}
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
									<FloatField label={'Brand Name'} value={formData.hotelName || ''} readOnly />
								</div>

								{formData.campaign && (
									<div className='mb-5'>
										<FloatField label={'Campaign'} value={formData.campaign || ''} readOnly />
									</div>
								)}

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
										{formData?.questions?.length}
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
											<div className='_flex mb-3'>
												<UploadFileButton
													files={uploads?.brandStandard}
													onClick={() => {
														setUploadModal({
															open: true,
															data: {
																id: 'brandStandard',
																title: 'Brand Standard',
																files: uploads?.brandStandard,
															},
														});
													}}
												/>
											</div>

											<SummaryTextField
												value={formData?.brandStandard || ''}
												onChange={(el) => setFormData({ ...formData, brandStandard: el.target.value })}
											/>
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className='box'>
										<CategoryPanel
											title={'Executive Summary'}
											summaryField={formData?.executiveSummary || ''}>
											<div className='_flex mb-3'>
												<UploadFileButton
													files={uploads?.executiveSummary}
													onClick={() => {
														setUploadModal({
															open: true,
															data: {
																id: 'executiveSummary',
																title: 'Executive Summary',
																files: uploads?.executiveSummary,
															},
														});
													}}
												/>
											</div>

											<SummaryTextField
												value={formData?.executiveSummary || ''}
												onChange={(el) => setFormData({ ...formData, executiveSummary: el.target.value })}
											/>
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className='box'>
										<CategoryPanel title={'Detailed Summary'} summaryField={formData?.detailedSummary || ''}>
											<div className='_flex mb-3'>
												<UploadFileButton
													files={uploads?.detailedSummary}
													onClick={() => {
														setUploadModal({
															open: true,
															data: {
																id: 'detailedSummary',
																title: 'Detailed Summary',
																files: uploads?.detailedSummary,
															},
														});
													}}
												/>
											</div>

											<SummaryTextField
												value={formData?.detailedSummary || ''}
												onChange={(el) => setFormData({ ...formData, detailedSummary: el.target.value })}
											/>
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className='box'>
										<CategoryPanel title={'Scenario'} summaryField={formData?.scenario || ''}>
											<div className='_flex mb-3'>
												<UploadFileButton
													files={uploads?.scenario}
													onClick={() => {
														setUploadModal({
															open: true,
															data: {
																id: 'scenario',
																title: 'Scenario',
																files: uploads?.scenario,
															},
														});
													}}
												/>
											</div>

											<SummaryTextField
												value={formData?.scenario || ''}
												onChange={(el) => setFormData({ ...formData, scenario: el.target.value })}
											/>
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className='box'>
										<CategoryPanel title={'Expense'} summaryField={formData?.expense || ''}>
											<div className='_flex mb-3'>
												<UploadFileButton
													files={uploads?.expense}
													onClick={() => {
														setUploadModal({
															open: true,
															data: {
																id: 'expense',
																title: 'Expense',
																files: uploads?.expense,
															},
														});
													}}
												/>
											</div>

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
										<option value={'in progress'}>In progress</option>
										<option value={'completed'}>Completed</option>
										<option value={'abandoned'}>Abandoned</option>
									</select>
								</div>
							</div>

							<div className='py-5 _flex'>
								<button
									type='button'
									onClick={nextStep}
									className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
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
					<FileModal
						openModal={fileModal}
						setOpenModal={setFileModal}
						handleInputChange={handleInputChange}
						survey={formData}
					/>
				)}

				{uploadModal.open && (
					<UploadsModal
						openModal={uploadModal}
						setOpenModal={setUploadModal}
						updateState={setUploads}
						survey={formData}
					/>
				)}
			</div>
		</main>
	);
};

function toggleFullscreen() {
	if (document.fullscreenElement) {
		// If already in fullscreen, exit fullscreen
		document.exitFullscreen();
	} else {
		// If not in fullscreen, request fullscreen
		document.documentElement.requestFullscreen();
	}
}

export default CustomerAudit;

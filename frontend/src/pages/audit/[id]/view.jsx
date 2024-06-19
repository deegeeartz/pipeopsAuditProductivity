import { useEffect, useState } from 'react';
import Layout from '@/components/layout/DashboardLayout';
import { RiAddFill, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';
import { Accordion } from 'flowbite-react';
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
import { getUser } from '@/utils/auth';

const ViewAudit = () => {
	const router = useRouter();
	const { id: auditId } = router.query;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({});
	const [audit, setAudit] = useState({});
	const [categories, setCategories] = useState([]);
	const [responses, setResponses] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [fileModal, setFileModal] = useState({ open: false, data: {} });

	const fetchData = async () => {
		try {
			const res = await http.get('/audit/' + auditId);

			if (res?.status == 200) {
				console.log(res.data.result);

				setAudit(res.data.result);
				setResponses(res.data.result.responses);
				setFormData(res.data.result.survey);
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
		console.log(formData);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		step == 1 ? setStep(2) : setStep(1);
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
			Scenario: formData?.Scenario,
			status: formData?.status || 'in progress',
			auditId,
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
					<h1 className='font-bold text-lg text-[#222]'>Audit #{auditId}</h1>

					{/* <Link href='/inspector/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>All Surveys</span>
					</Link> */}
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full readOnly' onSubmit={onFormSubmit}>
						<div className={`step1 details ${step !== 1 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div className='mb-5'>
								<SelectField label={'Client'} value={formData.clientId ?? ''} disable={true}>
									<option value={formData.clientId}>{formData.clientName}</option>
								</SelectField>
							</div>

							<div className='mb-5'>
								<FloatField label={'Hotel Name'} value={formData.hotelName ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Campaign'} value={formData.campaign ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField label={'Location'} value={formData.location ?? ''} readOnly />
							</div>

							<div className='mb-5'>
								<FloatField
									label={'Start Date'}
									value={new Date(formData.startDate).toDateString() ?? ''}
									readOnly
								/>
							</div>

							<div className='mb-5'>
								<FloatField
									label={'End Date'}
									value={new Date(formData.endDate).toDateString() ?? ''}
									readOnly
								/>
							</div>
						</div>

						<div className={`step2 questionnaire ${step !== 2 && 'hidden'}`}>
							<h3 className='heading text-xl font-semibold pt-4 mb-8 uppercase'>Questionnaire</h3>

							{!formData?.questions?.length ? (
								<p className='text-gray-400 mb-4'>No questions found!</p>
							) : (
								<div className='mb-5'>
									<Accordion>
										{categories.map((category) => (
											<Accordion.Panel key={category.id} className='box'>
												<CategoryPanel title={category.title} count={category.questions.length}>
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
									<CategoryPanel title={'Brand Standard'}>
										<SummaryTextField value={audit?.brandStandard ?? ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Executive Summary'}>
										<SummaryTextField value={audit?.executiveSummary ?? ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Detailed Summary'}>
										<SummaryTextField value={audit?.detailedSummary ?? ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Scenario'}>
										<SummaryTextField value={audit?.Scenario ?? ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>

								<Accordion.Panel className='box'>
									<CategoryPanel title={'Expense'}>
										<SummaryTextField value={audit?.expense ?? ''} readOnly />
									</CategoryPanel>
								</Accordion.Panel>
							</Accordion>

							<div className='py-5 mt-4'>
								<p className='text-[15px] font-medium pb-2'>Audit Status</p>

								<select
									className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-[#252525] block w-full p-2.5 '
									value={audit.status || ''}
									readOnly
									disabled
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

							{getUser().role == 'CLIENT' && (
								<button type='submit' className='btn_primary _flex !px-[5px] !py-[10px] md:!px-[30px]'>
									<RiAddFill size={22} className='mr-1.5' />
									<span>Submit Feedback</span>
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

export default ViewAudit;

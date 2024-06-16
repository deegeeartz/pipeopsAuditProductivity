import { useState } from 'react';
import Layout from '@/components/Layout';
import { RiAddFill, RiArrowLeftLine, RiDeleteBin4Fill } from 'react-icons/ri';

import Link from 'next/link';
import { Accordion, Badge, FloatingLabel, Select } from 'flowbite-react';

const CreateSurveys = () => {
	// const [openDelModal, setOpenDelModal] = useState(false);

	const SelectField = ({ label, style, children }) => (
		<div class={`relative w-full ${style}`}>
			<select
				id='countries'
				class='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:!border-[#252525] peer'>
				{children}
			</select>
			<label
				for='floating_outlined'
				class='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#252525] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'>
				{label}
			</label>
		</div>
	);

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Create Surveys</h1>
					<Link href='/admin/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>View All</span>
					</Link>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form class='w-full'>
						<div className='level details hidden'>
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Survey Details</h3>

							<div class='mb-5'>
								<SelectField label={'Client'}>
									<option>select client</option>
									<option>Canada</option>
									<option>France</option>
									<option>Germany</option>
								</SelectField>
							</div>

							<div class='mb-5'>
								{/* <label class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Brand</label> */}
								<FloatingLabel variant='outlined' label='Brand' />
							</div>

							<div class='mb-5'>
								<FloatingLabel variant='outlined' label='Campaign' />
							</div>

							<div class='mb-5'>
								<FloatingLabel variant='outlined' label='Location' />
							</div>

							<div class='mb-5'>
								<SelectField label={'Assign Inspector'}>
									<option>select inspector</option>
									<option>Paul Smith</option>
									<option>France</option>
									<option>Germany</option>
								</SelectField>
							</div>
						</div>

						<div className='level questionnaire'>
							{/* <div className='mt-7 mb-6 border border-gray-300' /> */}
							<h3 className='heading text-xl font-semibold mb-8 uppercase'>Questionnaire</h3>

							{/* <p className='heading text-base font-semibold mb-4'>Add Category</p>
							<div class='mb-5 flex items-center'>
								<div className='w-full'>
									<FloatingLabel variant='outlined' width={100} label='Enter Category' />
								</div>

								<button className='btn_primary ml-2 !py-[11px] mb-[8px]'>
									<RiAddFill size={24} />
								</button>
							</div> */}

							{/* <div className='mt-7 mb-6 border border-gray-300' /> */}
							<div className='fx_between mb-6'>
								<p className='heading text-base font-medium'>Add Questions</p>
								<div className='btn_outline'>New category</div>
							</div>

							<div class='mb-5 w-full md:flex'>
								<SelectField label='Category'>
									<option>select category</option>
									<option>Check out and departure - General</option>
									<option>Health Check and customer service</option>
									<option>Germany</option>
								</SelectField>

								<SelectField label='Type' style='md:w-1/3 md:ml-4 mt-4 md:m-0'>
									<option>select field type</option>
									<option>Input</option>
									<option>Options</option>
								</SelectField>
							</div>

							<div class='mb-5 md:flex items-center'>
								<div className='w-full mb-4 md:mb-0'>
									<FloatingLabel variant='outlined' width={100} label='Enter Question' />
								</div>

								<button className='btn_primary _flex md:ml-2 !py-[11px] mb-[8px]'>
									<RiAddFill size={24} />
									<span className='ml-3 md:hidden'>Add</span>
								</button>
							</div>

							<div className='mt-7 mb-6 border border-gray-300' />
							<p className='heading text-base font-medium mb-5'>Questions</p>

							<div className='mb-5'>
								<Accordion>
									<Accordion.Panel>
										<Accordion.Title>
											<div className='capitalize fx_between'>
												<h5 className='text-sm'>Check out and departure - General</h5>
												<Badge color='failure' className='px-4 ml-2'>
													2
												</Badge>
											</div>
										</Accordion.Title>
										<Accordion.Content>
											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#1</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>

											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#2</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>
										</Accordion.Content>
									</Accordion.Panel>

									<Accordion.Panel>
										<Accordion.Title>
											<div className='capitalize fx_between'>
												<h5 className='text-sm'>Arrival and check in - Reception</h5>
												<Badge color='failure' className='px-4 ml-2'>
													1
												</Badge>
											</div>
										</Accordion.Title>
										<Accordion.Content>
											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#1</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>

											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#1</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>
										</Accordion.Content>
									</Accordion.Panel>

									<Accordion.Panel>
										<Accordion.Title>
											<div className='capitalize fx_between'>
												<h5 className='text-sm'>Arrival and check in - General</h5>
												<Badge color='failure' className='px-4 ml-2'>
													1
												</Badge>
											</div>
										</Accordion.Title>
										<Accordion.Content>
											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#1</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>

											<div className='box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md'>
												<div>
													<i className='text-[13px] font-semibold pr-3'>#1</i>
													<span className='text-[13px] font-medium'>
														How was your experience at the hotel?
													</span>
												</div>

												<RiDeleteBin4Fill className='mx-2' />
											</div>
										</Accordion.Content>
									</Accordion.Panel>
								</Accordion>
							</div>
						</div>

						<div className='py-5'>
							<button
								type='submit'
								class='text-white bg-[#252525] hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-2.5 text-center mr-4'>
								Previous
							</button>

							<button
								type='submit'
								class='text-white bg-[#252525] hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-2.5 text-center'>
								Create Survey
							</button>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default CreateSurveys;
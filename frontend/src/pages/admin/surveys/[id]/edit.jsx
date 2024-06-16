import { useState } from "react";
import Layout from "@/components/Layout";
import { RiAddFill, RiArrowLeftLine, RiDeleteBin4Fill, RiUploadLine } from "react-icons/ri";

import Link from "next/link";
import { Accordion } from "flowbite-react";
import { FloatField, SelectField } from "@/components/Fields";
import { CategoryPanel, QuestionBox } from "@/components/QuestionUI";

const EditSurvey = () => {
	// const [openDelModal, setOpenDelModal] = useState(false);
	const [step, setStep] = useState(1);

	return (
		<Layout>
			<div className="content p-6">
				<div className="mb-7 flex justify-between items-center">
					<h1 className="font-bold text-lg text-[#222]">Edit Survey</h1>
					<Link href="/admin/surveys" className="btn_primary _flex">
						<RiArrowLeftLine className="mr-2 h-5 w-5" />
						<span className="hidden md:block">View All</span>
					</Link>
				</div>

				<div className="py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5">
					<form class="w-full">
						<div className={`step1 details ${step !== 1 && "hidden"}`}>
							<h3 className="heading text-xl font-semibold mb-8 uppercase">Survey Details</h3>

							<div class="mb-5">
								<SelectField label={"Client"}>
									<option>select client</option>
									<option>KM Hotels</option>
									<option>JEntertainment LTD</option>
									<option></option>
								</SelectField>
							</div>

							<div class="mb-5">
								<FloatField label={"Brand"} value={""} />
							</div>

							<div class="mb-5">
								<FloatField label={"Campaign"} value={""} />
							</div>

							<div class="mb-5">
								<FloatField label={"Location"} value={""} />
							</div>

							<div class="mb-5">
								<SelectField label={"Assign Inspector"}>
									<option>select inspector</option>
									<option>Paul Smith</option>
									<option>David Samuel</option>
								</SelectField>
							</div>
						</div>

						<div className={`step2 questionnaire ${step !== 2 && "hidden"}`}>
							<h3 className="heading text-xl font-semibold mb-8 uppercase">Questionnaire</h3>

							<div className="fx_between mb-7">
								<p className="heading text-base font-medium">Add Questions</p>
								<div className="btn_outline">New category</div>
							</div>

							<div class="mb-5 w-full md:flex">
								<SelectField label="Category">
									<option>select category</option>
									<option>Check out and departure - General</option>
									<option>Check out and departure - Reception</option>
									<option>Health Check and customer service</option>
								</SelectField>

								<SelectField label="Type" style="md:w-1/3 md:ml-4 mt-4 md:m-0">
									<option>select field type</option>
									<option>Input</option>
									<option>Options</option>
								</SelectField>
							</div>

							<div class="mb-5 md:flex items-center">
								<div className="w-full mb-4 md:mb-0">
									<FloatField label={"Enter Question"} value={""} />
								</div>

								<button className="btn_primary _flex md:ml-2 !py-[11px] mb-[8px]">
									<RiAddFill size={24} />
									<span className="ml-3 md:hidden">Add</span>
								</button>
							</div>

							<div className="mt-7 mb-6 border border-gray-300" />
							<p className="heading text-base font-medium mb-7">Questions</p>

							<div className="mb-5">
								<Accordion>
									<Accordion.Panel className="box">
										<CategoryPanel title={"Check out and departure - General"} count={2}>
											<QuestionBox id={2} type={"Input"} title="How was your experience at the hotel?" />
											<QuestionBox id={2} type={"Option"} title="How was your experience at the hotel?" />
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className="box">
										<CategoryPanel title={"Arrival and check in - Reception"} count={1}>
											<QuestionBox id={2} type={"Option"} title="How was your experience at the hotel?" />
										</CategoryPanel>
									</Accordion.Panel>

									<Accordion.Panel className="box">
										<CategoryPanel title={"Check out and departure - General"} count={1}>
											<QuestionBox id={2} type={"Input"} title="How was your experience at the hotel?" />
											<QuestionBox id={2} type={"Option"} title="How was your experience at the hotel?" />
										</CategoryPanel>
									</Accordion.Panel>
								</Accordion>
							</div>
						</div>

						<div className="py-5 _flex">
							<button
								type="button"
								onClick={() => (step == 1 ? setStep(2) : setStep(1))}
								class="btn_primary !py-[10px] md:!px-[30px] mr-4">
								{step == 1 ? "Next" : "Previous"}
							</button>

							{step == 2 && (
								<button type="submit" class="btn_primary _flex !px-[10px] !py-[10px] md:!px-[30px]">
									<RiUploadLine size={22} className="mr-1.5" />
									<span>Update Survey</span>
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default EditSurvey;

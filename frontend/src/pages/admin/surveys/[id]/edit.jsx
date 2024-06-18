import { useState } from 'react';
import Layout from '@/components/Layout';
import { RiAddFill, RiArrowLeftLine, RiDeleteBin4Fill, RiUploadLine } from 'react-icons/ri';
import Link from 'next/link';

const EditSurvey = () => {
	// const [openDelModal, setOpenDelModal] = useState(false);
	const [step, setStep] = useState(1);

	return (
		<Layout>
			<div className='content p-6'>
				<div className='mb-7 flex justify-between items-center'>
					<h1 className='font-bold text-lg text-[#222]'>Edit Survey</h1>
					<Link href='/admin/surveys' className='btn_primary _flex'>
						<RiArrowLeftLine className='mr-2 h-5 w-5' />
						<span className='hidden md:block'>View All</span>
					</Link>
				</div>

				<div className='py-7 px-5 mb-8 bg-white rounded-md border border-gray-200 shadow-sm shadow-black/5'>
					<form className='w-full'>
						<div className='py-5 _flex'>
							<button
								type='button'
								onClick={() => (step == 1 ? setStep(2) : setStep(1))}
								className='btn_primary !py-[10px] md:!px-[30px] mr-4'>
								{step == 1 ? 'Next' : 'Previous'}
							</button>

							{step == 2 && (
								<button type='submit' className='btn_primary _flex !px-[10px] !py-[10px] md:!px-[30px]'>
									<RiUploadLine size={22} className='mr-1.5' />
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

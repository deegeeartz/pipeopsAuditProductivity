import { Accordion, Badge } from "flowbite-react";
import { RiDeleteBin4Fill } from "react-icons/ri";

export const CategoryPanel = ({ title, count, children }) => {
	return (
		<>
			<Accordion.Title className="!ring-opacity-0 py-4 hover:!bg-gray-50 focus:!bg-gray-50">
				<div className="capitalize fx_between">
					<h5 className="text-sm">{title}</h5>
					<Badge color="failure" className="px-4 ml-2">
						{count}
					</Badge>
				</div>
			</Accordion.Title>

			<Accordion.Content>{children}</Accordion.Content>
		</>
	);
};

export const QuestionBox = ({ id, title, type }) => {
	return (
		<div className="box fx_between py-2.5 px-3 mb-4 border border-gray-200 shadow-sm rounded-md">
			<div className="md:_flex">
				<i className="text-[13px] font-semibold pr-3">#{id}</i>
				<span className="text-[13px] font-medium">{title}</span>

				<Badge color="info" className="px-4 mt-1.5 w-fit">
					{type}
				</Badge>
			</div>

			<RiDeleteBin4Fill size={22} className="mx-2 md:mt-0" />
		</div>
	);
};

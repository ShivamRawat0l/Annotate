import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLayout } from "@/src/context/LayoutProvider";
import { SidebarClose, SidebarIcon } from "lucide-react";
import React from "react";
import { PinnedNotes } from "./components/PinnedNotes";
import { Input } from "@/components/ui/input";
import { globalStyles } from "@/src/constants/Styles";
import { useFolder } from "@/src/context/FolderProvider";

export const HomeHeader = () => {
	const { sidebarOpen, setSidebarOpen } = useLayout();
	const { selectedFolderPath, folderDetails } = useFolder();
	return <div>
		{sidebarOpen ? (
			<SidebarClose
				onClick={() => {
					setSidebarOpen(false);
				}}
			/>
		) : (
			<SidebarIcon
				onClick={() => {
					setSidebarOpen(true);
				}}
			/>
		)}
		<Breadcrumb>
			<BreadcrumbList>
				{selectedFolderPath.map((folderId: string) => (
					<React.Fragment key={folderId}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink>
								{folderDetails[folderId]?.title ?? ""}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
		{false && (
			<div
				style={{
					...globalStyles.flexRow,
					flex: 0,
					alignItems: "center",
				}}
			>
				<div style={{ whiteSpace: "nowrap", marginRight: 24 }}>
					<PinnedNotes />
				</div>
				<Input
					placeholder="Press CTRL + F to search"
					style={{ width: "260px" }}
				/>
			</div>
		)}
	</div>
}

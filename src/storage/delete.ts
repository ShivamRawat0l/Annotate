
const saveFolderData = () => {
	localStorage.setItem(
		DATA_STORAGE_KEY,
		JSON.stringify({ folderStructure, folderDetails, userEmail })
	);
};


const loadData = () => {
	const data = localStorage.getItem(DATA_STORAGE_KEY);
	if (data) {
		const fetchedData = JSON.parse(data);
		setUserEmail(fetchedData.userEmail);
		setFolderStructure(fetchedData.folderStructure);
		setFolderDetails(fetchedData.folderDetails);
	}
};

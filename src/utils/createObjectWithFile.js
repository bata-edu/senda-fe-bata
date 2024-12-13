import apiClient from "./interceptors/authInterceptor";


export const genericCreateAndUpload = async ({ body, createUrl, updateUrl, file, fileKey }) => {
    try {
        const createResponse = await apiClient.post(createUrl, body);
        const resourceId = createResponse.data.id || createResponse.data.exam.id;
        if (file) {
            const formData = new FormData();
            formData.append(fileKey, file);

            const uploadUrl = `${updateUrl}/${resourceId}`;
            await apiClient.patch(uploadUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        return createResponse.data;
    } catch (error) {
        console.error("Error durante el proceso:", error);
        throw new Error(error.response?.data || "Error al procesar la solicitud");
    }
};

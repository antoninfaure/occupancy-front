import { API_URL, getRequest } from "./utils"

const STUDYPLANS_URL = `${API_URL}/studyplans`

/// GET ///

export async function getStudyplans() {
    return getRequest(STUDYPLANS_URL);
}

export async function getStudyplan(id: string) {
    return getRequest(`${STUDYPLANS_URL}/${id}`);
}
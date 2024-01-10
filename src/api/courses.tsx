import { API_URL, getRequest } from "./utils"

const COURSES_URL = `${API_URL}/courses`

/// GET ///

export async function getCourses() {
    return getRequest(COURSES_URL);
}

export async function getCourse(code: string) {
    return getRequest(`${COURSES_URL}/${code}`);
}
import { API_URL, getRequest, postRequest, putRequest } from "./utils"

const ROOMS_URL = `${API_URL}/rooms`

/// GET ///

export async function getRooms() {
    return getRequest(ROOMS_URL);
}

export async function getRoom(name: string) {
    return getRequest(`${ROOMS_URL}/${name}`);
}

/// POST ///
export async function findFreeRooms(schedules: any) {
    return postRequest(`${ROOMS_URL}/find_free_rooms`, schedules);
}
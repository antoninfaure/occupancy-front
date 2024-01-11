import { API_URL, getRequest, postRequest } from "./utils"

const ROOMS_URL = `${API_URL}/rooms`

/// GET ///

export async function getRooms() {
    return getRequest(ROOMS_URL);
}

export async function getRoom(name: string) {
    return getRequest(`${ROOMS_URL}/${name}`);
}

/// POST ///
export async function findFreeRooms(schedules: any, coordinates: any) {
    let payload = {
        selection: schedules
    } as any

    if (coordinates !== undefined) {
        payload["coordinates"] = coordinates
    }

    return postRequest(`${ROOMS_URL}/find_free_rooms`, payload);
}

export async function findSoonestAvailability() {
    const after_date = new Date()
    after_date.setHours(after_date.getHours() - 1)
    return postRequest(`${ROOMS_URL}/find_soonest_bookings`, {
        after_date: after_date.toISOString()
    });
}
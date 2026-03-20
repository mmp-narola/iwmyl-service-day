interface GetEventListParams {
  page?: number;
  per_page?: number;
  search?: string;
  dateRange?: string;
  status?: string;
}

export const fetchGroupEvents = (params: GetEventListParams = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(typeof value === "number" && isNaN(value))
    ) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();

  return {
    url: queryString
      ? `/public/event-list?${queryString}`
      : `/public/event-list`,
    method: "GET",
  };
};

export const fetchGroupEventById = (eventId: string) => ({
  url: `/public/event/${eventId}`,
  method: "GET",
});

export const fetchEventImages = (eventId: string | number) => ({
  url: `/public/event/images/${eventId}`,
  method: "GET",
});

/**
 * useEvents.js
 * ============================================================
 * Custom hook for fetching events (list + detail).
 * Handles loading, error, and data states.
 * ============================================================
 */

import { useState, useEffect, useCallback } from "react";
import Axios from "@/services/api/axios";
import {
  fetchGroupEvents,
  fetchGroupEventById,
  fetchEventImages,
} from "@/services/endPoints/events.endpoints";

/**
 * Fetch paginated/filtered event list
 * @param {Object} filters - { zip, dateRange, status }
 */
export function useEventsList(filters: any = {}) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(filters.page || 1);
  const [perPage, setPerPage] = useState(filters.per_page || 10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filterString = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Select the correct API endpoint based on the slug
      let fetchApi = fetchGroupEvents;

      const res = await Axios(
        fetchApi({ ...filters, page, per_page: perPage }),
      );

      const fetchedEvents =
        res.data?.data?.data || res.data?.events || res.data || [];
      setEvents(fetchedEvents);

      // Extract pagination metadata
      const meta = res.data?.data || {};
      setTotal(meta.total_records || fetchedEvents.length);
      setTotalPages(meta.total_pages || 1);
    } catch (err: any) {
      console.error("Failed to fetch events", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filterString, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    events,
    loading,
    error,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      setPage,
      setPerPage,
    },
    reload: load,
  };
}

/**
 * Fetch single event by ID
 * @param {string|number} eventId
 */
export function useEventDetail(eventId: string | number) {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Axios(fetchGroupEventById(String(eventId)));
      setEvent(res.data?.data || res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Event not found.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  return { event, loading, error, reload: load };
}

/**
 * Fetch impact photos for a single event
 * @param {string|number} eventId
 */
export function useEventImages(eventId: string | number) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Axios(fetchEventImages(eventId));
      console.log("res", res);
      setImages(res.data?.data || []);
    } catch (err: any) {
      console.error("Failed to fetch event images", err);
      setError(err.response?.data?.message || "Failed to load photos.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  return { images, loading, error, reload: load };
}

export default useEventsList;

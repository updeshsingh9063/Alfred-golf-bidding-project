import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from './api';

export function useFetch<T>(endpoint: string, initialData: T | null = null, options: any = {}) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(endpoint, options);
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDashboard() {
  return useFetch<any>('/users/dashboard');
}

export function useScores() {
  return useFetch<any>('/scores');
}

export function useCharities() {
  return useFetch<any>('/charities');
}

export function useDraws() {
  return useFetch<any>('/draws');
}

export function useWinnings() {
  return useFetch<any>('/users/winnings');
}

export function useSubscription() {
  return useFetch<any>('/subscriptions/my');
}

export function useAdminKPIs() {
  return useFetch<any>('/admin/analytics');
}

export function useAdminUsers(page: number = 1, limit: number = 20) {
  return useFetch<any>(`/admin/users?page=${page}&limit=${limit}`);
}

export function useAdminDraws(page: number = 1, limit: number = 10) {
  return useFetch<any>(`/admin/draws?page=${page}&limit=${limit}`);
}

export function useAdminWinners(page: number = 1, limit: number = 20) {
  return useFetch<any>(`/admin/winners?page=${page}&limit=${limit}`);
}

export function useAdminCharities() {
  return useFetch<any>('/admin/charities');
}

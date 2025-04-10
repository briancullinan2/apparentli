import { getBackendSrv } from '@grafana/runtime';

interface Dashboard {
  id: number;
  uid: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  isStarred: boolean;
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  try {
    const response = await getBackendSrv().get('/api/search', { type: 'dash-db' });
    return response as Dashboard[];
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
}

export async function fetchDashboardJson(uid: string): Promise<Dashboard[]> {
  try {
    const response = await getBackendSrv().get('/api/dashboards/uid/' + uid, { type: 'dash-db' });
    return response as any;
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
}



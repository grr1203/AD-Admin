import { SERVER_URL } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';

const getDeviceList = async () => {
  const res = await fetch(`${SERVER_URL}/api/device/list`);
  return await res.json();
};

export const useDeviceList = () => {
  const { data: deviceList, refetch: refetchDeviceList } = useQuery({
    queryKey: ['deviceList'],
    queryFn: getDeviceList,
  });

  return { deviceList, refetchDeviceList };
};

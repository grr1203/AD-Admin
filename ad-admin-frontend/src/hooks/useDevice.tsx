import { SERVER_URL } from '@/constants/constants';
import { Device } from '@/constants/type';
import { fetchTimeout } from '@/services/fetch';
import { useQuery } from '@tanstack/react-query';

// Admin

// admin server에 등록된 device 목록 조회
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

// Client

// admin server를 통해 각 device server network 상태 조회
const getDeviceNetworkStatus = async (deviceList: Device[]) => {
  const deviceNetworkStatusList = await Promise.all(
    deviceList.map(async (device: Device) => {
      try {
        const res = await fetch(`${SERVER_URL}/api/ping?ip=${device.ip}`);
        if (res.status === 200 && (await res.json()) === 'on') {
          console.log('device.ip server on', device.ip);
          return { idx: device.idx, name: device.name, status: 'on' };
        } else throw Error('device.ip server error');
      } catch (err) {
        return { idx: device.idx, name: device.name, status: 'off' };
      }
    })
  );
  return deviceNetworkStatusList;
};
export const useDeviceNetworkStatus = (deviceList: Device[]) => {
  const {
    data: deviceNetworkStatusList,
    isLoading: isDeviceNetworkStatusLoading,
    refetch: refetchDeviceNetworkStatus,
  } = useQuery({
    queryKey: ['deviceNetworkStatusList'],
    queryFn: getDeviceNetworkStatus.bind(null, deviceList),
  });

  return { deviceNetworkStatusList, isDeviceNetworkStatusLoading, refetchDeviceNetworkStatus };
};

// 각 device server의 on/off 상태 조회
const getDeviceServerStatus = async (deviceList: Device[]) => {
  const deviceServerStatusList = await Promise.all(
    deviceList.map(async (device: Device) => {
      try {
        const res = await fetchTimeout(`http://${device.ip}/ad/main`, 4000);
        if (res.status === 200) return { idx: device.idx, name: device.name, status: 'on' };
        else throw Error('device.ip server error');
      } catch (err) {
        return { idx: device.idx, name: device.name, status: 'off' };
      }
    })
  );
  return deviceServerStatusList;
};
export const useDeviceServerStatus = (deviceList: Device[]) => {
  const {
    data: deviceServerStatusList,
    isLoading: isDeviceServerStatusLoading,
    refetch: refetchDeviceServerStatus,
  } = useQuery({
    queryKey: ['deviceServerStatusList'],
    queryFn: getDeviceServerStatus.bind(null, deviceList),
  });

  return { deviceServerStatusList, isDeviceServerStatusLoading, refetchDeviceServerStatus };
};

// 각 device server의 content 목록 조회
const getDeviceContentsList = async (deviceList: Device[]) => {
  const deviceContentsList = await Promise.all(
    deviceList.map(async (device: Device) => {
      try {
        const res = await fetchTimeout(`http://${device.ip}/ad/list`, 8000);
        const data = await res.json();
        if (res.status === 200) return { idx: device.idx, name: device.name, contentList: data.adList };
        else throw Error('device.ip server error');
      } catch (err) {
        return { idx: device.idx, name: device.name, contentList: [] };
      }
    })
  );
  return deviceContentsList;
};
export const useDeviceContentsList = (deviceList: Device[]) => {
  const {
    data: deviceContentsList,
    isLoading: isDeviceContentsListLoading,
    refetch: refetchDeviceContentsList,
  } = useQuery({
    queryKey: ['deviceContentsList'],
    queryFn: getDeviceContentsList.bind(null, deviceList),
  });

  return { deviceContentsList, isDeviceContentsListLoading, refetchDeviceContentsList };
};

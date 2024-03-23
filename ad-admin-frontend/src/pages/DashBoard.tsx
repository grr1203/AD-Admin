import { SERVER_URL } from '@/constants/constants';
import { useDeviceList } from '@/hooks/useDevice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Device } from '@/constants/type';
import { Switch } from '@/components/ui/switch';
import { MdSignalWifiStatusbarConnectedNoInternet2 } from 'react-icons/md';
import { MdSignalWifiStatusbar2Bar } from 'react-icons/md';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function DashBoard() {
  const navigate = useNavigate();
  const { deviceList } = useDeviceList();

  // 로그인 체크
  useEffect(() => {
    if (!localStorage.getItem('currentId')) {
      (async () => {
        const id = localStorage.getItem('id');
        const password = localStorage.getItem('password');

        if (id && password) {
          const res = await fetch(`${SERVER_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password }),
          });

          if (res.status !== 200) navigate('/login');
        } else navigate('/login');
      })();
    }
  });

  const dummyData = [
    {
      name: '으어아으어아어아야',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: '가나다라마바사',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: '아자차카 타파하하하하하',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Apr',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'May',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Jun',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Jul',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Aug',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Sep',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Oct',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Nov',
      total: Math.floor(Math.random() * 10),
    },
    {
      name: 'Mar',
      total: Math.floor(Math.random() * 10),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2 pt-8 px-8">
        <h1 className="text-4xl font-semibold tracking-tight pb-1">Dashboard</h1>
        <p className="text-muted-foreground">등록된 클라이언트 수 : {deviceList?.length ?? 0}</p>
      </div>

      <div className="flex-grow flex p-8 gap-8 overflow-auto">
        <div className="flex-[3] flex flex-col gap-8">
          <div className="flex justify-between gap-8">
            <StatusCard title="네트워크 상태" footer="IP connect status" on={30} off={11} />
            <StatusCard title="소프트웨어 상태" footer="Software connect status" on={12} off={12} />
          </div>

          <div className="flex-grow-[3] h-[calc(100%-24rem)] min-h-60">
            <Card className="h-full shadow-md">
              <CardHeader className="h-[8%] p-0 px-6 my-[2%]">
                <CardTitle className="font-extralight text-lg">컨텐츠 Top 12</CardTitle>
              </CardHeader>
              <CardContent className="h-[80%] p-0 pr-6">
                <ResponsiveContainer width="100%">
                  <BarChart data={dummyData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={-100}
                      // overflow="visible"
                      // interval={0}
                      // angle={-90}
                      // tick={CustomizedAxisTick2}
                    />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="relative p-4 rounded-lg shadow-md bg-[#FCFCFC] opacity-80">
                              <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
                              <p className="text-xs text-gray-600">PC에 업로드된 컨텐츠 수 : {payload[0].value}</p>
                            </div>
                          );
                        } else return null;
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="#686D76" // #496989 design todo
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex-[1] w-full flex">
          <Card className="w-full flex flex-col gap-1 shadow-md">
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="font-extralight text-xl mb-2">PC on/off 현황</CardTitle>
              <div className="flex justify-end gap-2">
                <div className="font-light">ON</div>
                <Switch className={`data-[state=checked]:bg-[${color.off}] data-[state=unchecked]:bg-[#007F73]`} />
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <ScrollArea className="rounded-md border overflow-auto">
                <div>
                  <h4 className="text-sm leading-none tracking-wide px-4 py-3 bg-[#F9F9F9] text-[#888888] flex justify-between">
                    <div className="flex-[1]">상태</div>
                    <div className="flex-[3]">등록명</div>
                  </h4>
                  <Separator />
                  {deviceList?.map((device: Device) => (
                    <div key={device.idx} className="pt-3 hover:bg-[#F5F6F5]">
                      <div className="flex justify-between items-center px-4 pb-3">
                        <div className="flex-[1] font-ligh pl-1">
                          <MdSignalWifiStatusbar2Bar className="w-5 h-5 text-[#007F73]" />
                          {/* <MdSignalWifiStatusbarConnectedNoInternet2 className='w-5 h-5 text-[#E72929]' /> */}
                        </div>
                        <div className="flex-[3] text-sm font-light">{device.name}</div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const color = { on: '#48BB78', off: '#F56565' };

const StatusCard = ({ title, footer, on, off }: { title: string; footer: string; on: number; off: number }) => {
  return (
    <Card className="h-64 shadow-md flex-[1]">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="font-extralight text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-40 py-2 flex">
        <div>
          <Doughnut
            options={{
              plugins: { legend: { display: false } },
            }}
            data={{
              labels: ['Off', 'On'],
              datasets: [
                {
                  data: [off, on],
                  backgroundColor: [color.off, color.on],
                  hoverBackgroundColor: ['#E53E3E', '#38A169'],
                  hoverOffset: 4,
                },
              ],
            }}
          />
        </div>
        <div className="mt-2 ml-8 flex flex-col min-w-24">
          <div className="flex items-center">
            <div className={`bg-[${color.on}] w-6 h-3 m-1 mr-2`} />
            <div className="text-[#333333]">On : {on}</div>
          </div>
          <div className="flex items-center">
            <div className={`bg-[${color.off}] w-6 h-3 m-1 mr-2`} />
            <div className="text-[#333333]">Off : {off}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <CardDescription>{footer}</CardDescription>
      </CardFooter>
    </Card>
  );
};

export default DashBoard;

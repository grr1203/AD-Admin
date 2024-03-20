import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { fetchServer } from '@/services/fetch';
import { SERVER_URL } from '@/constants/constants';
import { useToast } from '@/components/ui/use-toast';
import { MdCircle } from 'react-icons/md';

type Device = { idx: number; name: string; ip: string; screenSize: string; code: string; registeredDate: string };
type screenSize = { width: number; height: number };

function Device() {
  const [openAddDeviceDialog, setOpenAddDeviceDialog] = useState(false);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [code, setCode] = useState('');
  const [screenSizeSelect, setScreenSizeSelect] = useState(false);
  const [screenSizeList, setScreenSizeList] = useState<screenSize[]>([]);
  const [deviceList, setDeviceList] = useState([]);
  const [openDeleteDeviceDialog, setOpenDeleteDeviceDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${SERVER_URL}/api/device/list`);
      const data = await res.json();
      setDeviceList(data);
    })();

    (async () => {
      const res = await fetch(`${SERVER_URL}/api/screenSize/list`);
      const data = await res.json();
      setScreenSizeList(data);
      setWidth(data[0].width);
      setHeight(data[0].height);
    })();
  }, []);

  const addDevice = async () => {
    if (name === '' || ip === '') {
      toast({ duration: 3000, description: '코드를 제외한 모든 정보를 입력해주세요.' });
      return;
    }

    const screenSize = { width, height };
    const res = await fetchServer('device', 'POST', { name, ip, screenSize, code, newScreenSize: screenSizeSelect });
    if (res.status === 200) {
      setOpenAddDeviceDialog(false);
      toast({ duration: 2000, description: '장비 추가 성공' });
      window.location.reload();
    }
  };

  const deleteDevice = async () => {
    const res = await fetchServer('device', 'DELETE', { idx: selectedRow });
    if (res.status === 200) {
      setOpenDeleteDeviceDialog(false);
      toast({ duration: 2000, description: '장비 제거 성공' });
      window.location.reload();
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight pb-4">Devices</h1>
          <p className="text-muted-foreground mb-16">등록된 클라이언트 수 : {`${deviceList.length}`}</p>
        </div>
      </div>
      {/* <Button
        variant="outline"
        onClick={() => {
          toast({
            // duration: 2000,
            description: '장비 추가 성공',
            title: 'Success',
          });
        }}
      >
        Show Toast
      </Button> */}
      <Dialog open={openAddDeviceDialog} onOpenChange={setOpenAddDeviceDialog}>
        <DialogTrigger asChild className="w-[100px]">
          <Button variant="outline">등록하기</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]" onSubmit={addDevice}>
          <DialogHeader>
            <DialogTitle>장치 등록</DialogTitle>
            <DialogDescription>디바이스 정보를 입력해주세요</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input id="name" className="col-span-3" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip" className="text-right">
                IP
              </Label>
              <Input id="ip" className="col-span-3" onChange={(e) => setIp(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                화면 사이즈
              </Label>
              <Select
                defaultValue="0"
                onValueChange={(e) => {
                  if (e.valueOf() === 'addSize') setScreenSizeSelect(true);
                  else {
                    setScreenSizeSelect(false);
                    setWidth(screenSizeList[parseInt(e.valueOf())].width);
                    setHeight(screenSizeList[parseInt(e.valueOf())].height);
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {...screenSizeList.map((screenSize, index) => {
                      return <SelectItem value={`${index}`}>{`${screenSize.width} x ${screenSize.height}`}</SelectItem>;
                    })}
                    <SelectSeparator />
                    <SelectItem value="addSize">사이즈 추가</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {screenSizeSelect && (
              <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-3" />
                <Input id="width" className="col-span-4" onChange={(e) => setWidth(parseInt(e.target.value))} />
                <div className="text-center">x</div>
                <Input id="height" className="col-span-4" onChange={(e) => setHeight(parseInt(e.target.value))} />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                코드
              </Label>
              <Input id="code" className="col-span-3" onChange={(e) => setCode(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" onClick={addDevice}>
              등록하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table className="w-[100%]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">No</TableHead>
            <TableHead className="w-[20%]">디바이스 이름</TableHead>
            <TableHead className="w-[15%]">IP</TableHead>
            <TableHead className="w-[15%]">스크린 크기</TableHead>
            <TableHead className="w-[15%]">코드</TableHead>
            <TableHead className="w-[15%]">등록일</TableHead>
            <TableHead className="w-[5%]">상태</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {...deviceList.map((device: Device) => {
            const screenSize = JSON.parse(device.screenSize);
            return (
              <TableRow key={device.idx}>
                <TableCell>{device.idx}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell className="tracking-wider">{device.ip}</TableCell>
                <TableCell>{`${screenSize.width} x ${screenSize.height}`}</TableCell>
                <TableCell>{device.code}</TableCell>
                <TableCell>{device.registeredDate.split(' ')[0]}</TableCell>
                <TableCell>
                  {device.idx % 2 === 1 ? (
                    <MdCircle className="text-[#5BB318]" />
                  ) : (
                    <MdCircle className="text-[#E72929]" />
                  )}
                </TableCell>
                <TableCell onClick={() => setSelectedRow(device.idx)} className="text-center p-0">
                  <Dialog open={openDeleteDeviceDialog} onOpenChange={setOpenDeleteDeviceDialog}>
                    <DialogTrigger asChild className="w-[45px] h-[28px]">
                      <Button variant="destructive">삭제</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>장치 제거</DialogTitle>
                        <DialogDescription>디바이스를 삭제하시겠습니까?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            취소
                          </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={deleteDevice}>
                          제거
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default Device;

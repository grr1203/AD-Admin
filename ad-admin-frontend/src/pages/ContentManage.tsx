import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Device } from '@/constants/type';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useDeviceList } from '@/hooks/useDevice';

function ContentManage() {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [scrrenDirection, setScreenDirection] = useState('height'); // width / height
  const [contentList, setContentList] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [openFailDialog, setOpenFailDialog] = useState('');
  const [openDeleteContentDialog, setOpenDeleteContentDialog] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [openChangeMainContentDialog, setOpenChangeMainContentDialog] = useState(false);
  const { toast } = useToast();
  const { deviceList } = useDeviceList();
  const [fetching, setFetching] = useState<AbortController | null>(null);

  useEffect(() => {
    if (!currentDevice) return;

    const screenSize = JSON.parse(currentDevice.screenSize);
    setScreenDirection(screenSize.width > screenSize.height ? 'width' : 'height');

    setContentList([]);
    (async () => await getContentList())();
  }, [currentDevice]);

  // 장치의 컨텐츠 목록 조회
  const getContentList = async () => {
    try {
      if (fetching) fetching.abort();
      const controller = new AbortController();
      setFetching(controller);

      const res = await fetch(`http://${currentDevice!.ip}/ad/list`, { signal: controller.signal });
      const data = await res.json();
      setContentList(data.adList);
    } catch (err) {
      //   console.error('error:', err);
      setContentList([]);
    }
  };

  // 파일 선택 후 업로드
  const handleUpload = async () => {
    if (!file) {
      setOpenFailDialog('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`http://${currentDevice!.ip}/ad`, { method: 'POST', body: formData });
      if (res.ok) {
        await getContentList();
        toast({ duration: 3000, description: '업로드 완료' });
      } else throw new Error(res.status.toString());
    } catch (err) {
      setOpenFailDialog(`업로드 중 오류가 발생했습니다. - ${err}`);
    }
  };

  // 클라이언트에 업로드된 컨텐츠 삭제
  const deleteContent = async () => {
    try {
      const res = await fetch(`http://${currentDevice!.ip}/ad`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: contentList[currentContentIndex] }),
      });
      if (res.ok) {
        await getContentList();
        setOpenDeleteContentDialog(false);
        toast({ duration: 3000, description: '삭제 완료' });
      } else throw new Error(res.status.toString());
    } catch (err) {
      setOpenFailDialog(`컨텐츠 삭제 중 오류가 발생했습니다. - ${err}`);
    }
  };

  // 클라이언트의 메인 컨텐츠 변경
  const changeMainContent = async () => {
    try {
      const res = await fetch(`http://${currentDevice!.ip}/ad/main`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: contentList[currentContentIndex] }),
      });
      if (res.ok) {
        setOpenChangeMainContentDialog(false);
        toast({ duration: 3000, description: '메인 컨텐츠 변경 완료' });
      } else throw new Error(res.status.toString());
    } catch (err) {
      setOpenFailDialog(`메인 컨텐츠 변경 중 오류가 발생했습니다. - ${err}`);
    }
  };

  return (
    <div className="hidden h-[100vh] flex-col gap-8 md:flex">
      <div className="space-y-2 px-8 pt-8">
        <h1 className="text-4xl font-semibold tracking-tight pb-1">Contents</h1>
        <p className="text-muted-foreground">컨텐츠 관리</p>
      </div>
      <div className="h-full flex flex-grow overflow-hidden justify-between gap-8 px-8 pb-8">
        <Card className="flex flex-col gap-1 flex-[3] shadow">
          <CardHeader>
            <CardTitle className="font-normal">장치 목록</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <ScrollArea className="h-full rounded-md border">
              <div>
                <h4 className="text-sm font-medium leading-none tracking-wide px-4 py-4 bg-[#F9F9F9] text-[#888888] flex justify-between">
                  <div className="flex-[2]">등록명</div>
                  <div className="flex-[1]">IP</div>
                </h4>
                <Separator />
                {deviceList?.map((device: Device) => (
                  <div
                    key={device.idx}
                    className="pt-3 hover:bg-[#F5F6F9] cursor-pointer"
                    onClick={() => setCurrentDevice(device)}
                  >
                    <div className="flex justify-between px-4 pb-3">
                      <div className="flex-[2] text-sm">{device.name}</div>
                      <div className="flex-[1] text-sm">{device.ip}</div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="h-full flex-[6] flex flex-col gap-1 shadow">
          <CardHeader>
            <CardTitle className="font-normal">{currentDevice?.name}</CardTitle>
          </CardHeader>
          {currentDevice ? (
            scrrenDirection === 'height' ? (
              <CardContent className="flex h-full justify-center items-start">
                <div className="w-full h-full flex justify-center items-center gap-10 pr-10">
                  <div className="flex-[6] h-full flex justify-center">
                    <iframe
                      src={`http://${currentDevice?.ip}`}
                      title="Client"
                      className={`h-[95%] aspect-[9/16] relative rounded-sm`}
                    ></iframe>
                  </div>
                  <div className="flex-[5] h-full flex-col justify-between">
                    <ScrollArea className={`h-3/4 rounded-md border overflow-auto`}>
                      <h4 className="text-sm font-medium leading-none tracking-wide px-4 py-4 bg-[#F9F9F9] text-[#888888]">
                        컨텐츠 목록
                      </h4>
                      <Separator />
                      {contentList.length > 0 ? (
                        contentList.map((content, index) => (
                          <div key={content} className="pt-3 hover:bg-[#F5F6F9]" onClick={() => {}}>
                            <div className="flex justify-between pb-1 px-4 ">
                              <div className="text-sm">{content}</div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="flex focus-visible:ring-0 focus-visible:ring-offset-0 h-6 w-6 p-0 data-[state=open]:bg-muted"
                                  >
                                    <HiDotsHorizontal className="h-4 w-4 text-[#555555]" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[160px]"
                                  onClick={() => setCurrentContentIndex(index)}
                                >
                                  <DropdownMenuItem onClick={() => setOpenChangeMainContentDialog(true)}>
                                    적용
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => setOpenDeleteContentDialog(true)}>
                                    삭제
                                    <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <Separator />
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 hover:bg-[#F5F6F9] cursor-pointer">
                          <div className="flex justify-between">
                            <div className="text-sm text-[#999999]">No Contents</div>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                    <div className="grid w-full items-center gap-3 mt-5">
                      <Input
                        id="picture"
                        type="file"
                        accept="video/*,image/*"
                        onChange={(event) => event.target.files && setFile(event.target.files[0])}
                      />
                      <Button onClick={handleUpload}>업로드</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex-grow overflow-auto">
                <div className="w-full flex-col flex-grow justify-center items-center gap-10">
                  <div className="flex mb-6 items-end">
                    <iframe
                      src={`http://${currentDevice?.ip}`}
                      title="Client"
                      className={`flex-[3] aspect-[16/9] relative rounded-sm pr-6`}
                    ></iframe>
                    <div className="flex-[1] grid">
                      <Input
                        className="mb-3"
                        id="picture"
                        type="file"
                        accept="video/*,image/*"
                        onChange={(event) => event.target.files && setFile(event.target.files[0])}
                      />
                      <Button onClick={handleUpload}>업로드</Button>
                    </div>
                  </div>
                  <ScrollArea className={`h-full rounded-md border overflow-auto`}>
                    <h4 className="text-sm font-medium leading-none tracking-wide px-4 py-4 bg-[#F9F9F9] text-[#888888]">
                      컨텐츠 목록
                    </h4>
                    <Separator />
                    {contentList.length > 0 ? (
                      contentList.map((content, index) => (
                        <div key={content} className="pt-3 hover:bg-[#F5F6F9]" onClick={() => {}}>
                          <div className="flex justify-between pb-2 px-4">
                            <div className="text-sm">{content}</div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="flex focus-visible:ring-0 focus-visible:ring-offset-0 h-6 w-6 p-0 data-[state=open]:bg-muted"
                                >
                                  <HiDotsHorizontal className="h-4 w-4 text-[#555555]" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-[160px]"
                                onClick={() => setCurrentContentIndex(index)}
                              >
                                <DropdownMenuItem onClick={() => setOpenChangeMainContentDialog(true)}>
                                  적용
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpenDeleteContentDialog(true)}>
                                  삭제
                                  <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <Separator />
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 hover:bg-[#F5F6F9] cursor-pointer">
                        <div className="flex justify-between">
                          <div className="text-sm text-[#999999]">No Contents</div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            )
          ) : (
            <div className="h-full flex justify-center items-center text-[#999999]">장치를 선택해주세요</div>
          )}
        </Card>
        <Dialog open={openFailDialog !== ''} onOpenChange={(open) => !open && setOpenFailDialog('')}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle style={{ marginBottom: '12px' }}>업로드 실패</DialogTitle>
              <DialogDescription style={{ marginBottom: '20px' }}>{openFailDialog}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openDeleteContentDialog} onOpenChange={setOpenDeleteContentDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="pb-2">컨텐츠 삭제</DialogTitle>
              <DialogDescription>{contentList[currentContentIndex]} 파일을 삭제하시겠습니까?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={deleteContent}>
                제거
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openChangeMainContentDialog} onOpenChange={setOpenChangeMainContentDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="pb-2">메인 컨텐츠 변경</DialogTitle>
              <DialogDescription>
                {currentDevice?.name}의 메인 컨텐츠를 {contentList[currentContentIndex]} 파일로 변경하시겠습니까?{' '}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </DialogClose>
              <Button variant="default" onClick={changeMainContent}>
                업데이트
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ContentManage;

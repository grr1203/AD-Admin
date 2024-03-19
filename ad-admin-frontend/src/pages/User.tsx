import { SERVER_URL } from '@/constants/constants';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type User = { idx: number; id: string };

function User() {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${SERVER_URL}/api/user/list`);
      const data = await res.json();
      setUserList(data);
    })();
    setCurrentUser(localStorage.getItem('currentId') || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentId');
    localStorage.removeItem('id');
    localStorage.removeItem('password');
    navigate('/login');
  };

  return (
    <>
      <Card className="w-[420px] mb-10">
        <CardHeader>
          <CardTitle>User</CardTitle>
          <CardDescription className="pt-2">현재 관리자 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className='text-base' htmlFor="name">{currentUser || 'Unknown'}</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
      <Table className='w-[55%]'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Index</TableHead>
            <TableHead>아이디</TableHead>
            <TableHead className="w-[30%]">권한</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {...userList.map((user: User) => (
            <TableRow key={user.idx}>
              <TableCell>{user.idx}</TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>Administrator</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default User;

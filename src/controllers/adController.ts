import { Response } from 'express';

export const login = async (req: any, res: Response) => {
  console.log('body', req.body);
  const query = `SELECT * FROM tb_user where id = '${req.body.id}'`;
  const row = req.db.prepare(query).all(); // 조회시에는 all method 사용

  // 존재하지 않는 id
  if (row.length === 0) return res.status(404).send('존재하지 않는 id 입니다.');

  // 비밀번호 체크
  if (row[0].password !== req.body.password) return res.status(401).send('비밀번호가 일치하지 않습니다.');
  
  res.send('로그인 성공');
};

import { Response } from 'express';

// main page의 광고 파일 이름 반환
export const getAdMain = async (req: any, res: Response) => {
  const query = `SELECT * FROM tb_file WHERE id = 1`;
  const row = req.db.prepare(query).all(); // 조회시에는 all method 사용
  console.log('row', row);
  res.send({ path: row[0].name });
};

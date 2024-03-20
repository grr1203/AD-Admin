import { Response } from 'express';

// 새로운 장비 등록 + 새 스크린 사이즈 (있는 경우) 등록
export const addDevice = async (req: any, res: Response) => {
  const { name, ip, screenSize, code, newScreenSize } = req.body;

  if (newScreenSize) {
    const query = `INSERT INTO tb_screenSize (width, height) VALUES ('${screenSize.width}', '${screenSize.height}')`;
    req.db.prepare(query).run();
  }

  const query = `INSERT INTO tb_device (name, ip, screenSize, code) 
  VALUES ('${name}', '${ip}', '${JSON.stringify(screenSize)}', '${code}')`;
  req.db.prepare(query).run();

  res.send('장비 추가 성공');
};

// 장비 삭제
export const deleteDevice = async (req: any, res: Response) => {
  const { idx } = req.body;

  const query = `DELETE FROM tb_device WHERE idx = ${idx}`;
  req.db.prepare(query).run();

  res.send('장비 삭제 성공');
};

export const getDeviceList = async (req: any, res: Response) => {
  const query = `SELECT * FROM tb_device`;
  const rows = req.db.prepare(query).all();

  res.json(rows);
}

// 현재 서버에 등록되어 있는 모든 스크린 사이즈 목록 조회
export const getScreenSizeList = async (req: any, res: Response) => {
  const query = `SELECT * FROM tb_screenSize`;
  const rows = req.db.prepare(query).all();

  res.json(rows);
};

// 스크린 사이즈 추가
export const addScreenSize = async (req: any, res: Response) => {
  const { width, height } = req.body;

  const query = `INSERT INTO tb_screenSize (width, height) VALUES ('${width}', '${height}')`;
  req.db.prepare(query).run();

  res.send('스크린 사이즈 추가 성공');
};


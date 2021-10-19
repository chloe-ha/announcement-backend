export const mockRequest = (userSession = undefined) => ({ session: { user: userSession } });
export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
export const mockNext = jest.fn().mockResolvedValue(null);

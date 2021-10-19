import { isAuth, isAdmin } from '../../middleware/access-control';
import { mockRequest, mockResponse, mockNext } from '../mocks/requests';

describe('isAuth', () => {
  it('should 401 when no active session', async () => {
    const res = mockResponse();
    await isAuth(mockRequest(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });
  it('should call next when active session', async () => {
    const req = mockRequest({ username: 'admin@admin.com' });
    const res = mockResponse();
    await isAuth(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('isAdmin', () => {
  it('should 403 when no active session', async () => {
    const res = mockResponse();
    await isAdmin(mockRequest(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalled();
  });
  it('should 403 when active session does not have role with write permission', async () => {
    const req = mockRequest({ username: 'admin@admin.com', role: { } });
    const res = mockResponse();
    await isAdmin(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalled();
  });
  it('should call next when active session has role with write permission', async () => {
    const req = mockRequest({ username: 'admin@admin.com', role: { write: true } });
    const res = mockResponse();
    await isAdmin(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

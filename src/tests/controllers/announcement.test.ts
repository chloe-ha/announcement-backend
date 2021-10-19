import { getAnnouncements } from '../../controllers/announcement';
import { mockRequest, mockResponse } from '../mocks/requests';

const fakeDate = new Date(2021, 7, 1, 1, 1, 1);

const announcements = [
  {
    title: 'T1', description: 'D1', datetime: fakeDate, role: { roleName: 'Staff' },
  },
  {
    title: 'T2', description: 'D2', datetime: fakeDate, role: { roleName: 'Staff' },
  },
  {
    title: 'T3', description: 'D3', datetime: fakeDate, role: { roleName: 'Manager' },
  },
];
jest.mock('../../models/announcement', () => ({
  find: () => ({
    populate: () => Promise.resolve(announcements),
  }),
}));

describe('getAnnouncements', () => {
  it('should return staff announcements for staff users', async () => {
    const req = mockRequest({ role: { roleName: 'Staff' } });
    const res = mockResponse();
    await getAnnouncements(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        title: 'T1', description: 'D1', datetime: fakeDate, roleName: 'Staff',
      },
      {
        title: 'T2', description: 'D2', datetime: fakeDate, roleName: 'Staff',
      },
    ]);
  });
  it('should return staff/manager announcements for Manager users', async () => {
    const req = mockRequest({ role: { roleName: 'Manager' } });
    const res = mockResponse();
    await getAnnouncements(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        title: 'T1', description: 'D1', datetime: fakeDate, roleName: 'Staff',
      },
      {
        title: 'T2', description: 'D2', datetime: fakeDate, roleName: 'Staff',
      },
      {
        title: 'T3', description: 'D3', datetime: fakeDate, roleName: 'Manager',
      },
    ]);
  });
  it('should return staff/manager announcements for Admin users', async () => {
    const req = mockRequest({ role: { roleName: 'Admin' } });
    const res = mockResponse();
    await getAnnouncements(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        title: 'T1', description: 'D1', datetime: fakeDate, roleName: 'Staff',
      },
      {
        title: 'T2', description: 'D2', datetime: fakeDate, roleName: 'Staff',
      },
      {
        title: 'T3', description: 'D3', datetime: fakeDate, roleName: 'Manager',
      },
    ]);
  });
});

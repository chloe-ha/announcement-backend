import { handleError, sendErrorMessage } from '../../helpers/error';
import { mockResponse } from '../mocks/requests';

const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

afterAll(() => {
  consoleError.mockReset();
});

describe('handleError', () => {
  it('should 500 with error', async () => {
    const res = mockResponse();
    const error = { error: 'error' };
    handleError(error, res);
    expect(consoleError).toBeCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(error);
  });
});

describe('sendErrorMessage', () => {
  it('should errorCode with error message', async () => {
    const res = mockResponse();
    const errorCode = 422;
    const errorMessage = 'Unprocessable entity';
    sendErrorMessage(errorCode, errorMessage, res);
    expect(consoleError).toBeCalledWith({ error: errorMessage });
    expect(res.status).toHaveBeenCalledWith(errorCode);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
